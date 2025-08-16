import { NextRequest, NextResponse } from 'next/server';
import { makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidDecode, proto } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, updateBotWhatsAppStatus, updateBotStats } from '../../../../lib/firebase';
import { Timestamp } from 'firebase/firestore';

interface WhatsAppBot {
  id: string;
  sock: any;
  qrCode?: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
}

class WhatsAppService {
  private bots: Map<string, WhatsAppBot> = new Map();

  async createBot(botId: string): Promise<void> {
    if (this.bots.has(botId)) {
      throw new Error(`Bot ${botId} already exists`);
    }

    this.bots.set(botId, {
      id: botId,
      sock: null,
      status: 'disconnected'
    });
  }

  async connectBot(botId: string): Promise<{ qrCode?: string; status: string }> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot ${botId} not found`);
    }

    try {
      // Update status to connecting
      bot.status = 'connecting';
      await updateBotWhatsAppStatus(botId, 'connecting');

      const { version } = await fetchLatestBaileysVersion();
      const { state, saveCreds } = await useMultiFileAuthState(`./temp_auth_${botId}`);

      const sock = makeWASocket({
        version,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys),
        },
        printQRInTerminal: true,
      });

      bot.sock = sock;
      this.setupEventHandlers(sock, botId, saveCreds);

      return { status: 'connecting' };
    } catch (error) {
      console.error(`Error connecting bot ${botId}:`, error);
      bot.status = 'error';
      await updateBotWhatsAppStatus(botId, 'error');
      throw error;
    }
  }

  private setupEventHandlers(sock: any, botId: string, saveCreds: any): void {
    sock.ev.on('connection.update', async (update: any) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        // Generate QR code data URL
        const qrCode = this.generateQRCode(qr);
        const bot = this.bots.get(botId);
        if (bot) {
          bot.qrCode = qrCode;
        }
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.connectionClosed;
        if (shouldReconnect) {
          console.log(`Bot ${botId} connection closed, attempting to reconnect...`);
          // Reconnection logic could be implemented here
        } else {
          console.log(`Bot ${botId} connection closed permanently`);
          const bot = this.bots.get(botId);
          if (bot) {
            bot.status = 'disconnected';
            updateBotWhatsAppStatus(botId, 'disconnected');
          }
        }
      } else if (connection === 'open') {
        console.log(`Bot ${botId} connected to WhatsApp`);
        const bot = this.bots.get(botId);
        if (bot) {
          bot.status = 'connected';
          bot.qrCode = undefined;
          updateBotWhatsAppStatus(botId, 'connected');
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m: any) => {
      if (m.type === 'notify') {
        for (const message of m.messages) {
          await this.handleIncomingMessage(sock, botId, message);
        }
      }
    });
  }

  private async handleIncomingMessage(sock: any, botId: string, message: any): Promise<void> {
    try {
      const messageContent = message.message?.conversation || 
                           message.message?.extendedTextMessage?.text || 
                           '';

      if (!messageContent) return;

      const sender = message.key.remoteJid;
      if (!sender || sender.includes('@g.us')) return; // Skip group messages

      // Send automatic response
      const response = "Hello! We are working on this feature.";
      
      await sock.sendMessage(sender, {
        text: response
      });

      // Update bot stats
      await updateBotStats(botId, {
        messageCount: 1, // Increment by 1
        lastActive: Timestamp.now()
      });

      console.log(`Bot ${botId} responded to message from ${sender}`);
    } catch (error) {
      console.error(`Error handling message for bot ${botId}:`, error);
    }
  }

  private generateQRCode(qr: string): string {
    // This is a simple QR code generation - in production you might want to use a proper QR library
    return `data:image/png;base64,${qr}`;
  }

  async disconnectBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) return;

    if (bot.sock) {
      bot.sock.end();
      bot.sock = null;
    }

    bot.status = 'disconnected';
    bot.qrCode = undefined;
    this.bots.delete(botId);

    await updateBotWhatsAppStatus(botId, 'disconnected');
  }

  async deleteBot(botId: string): Promise<void> {
    await this.disconnectBot(botId);
    
    // Clean up auth files from Firebase Storage
    try {
      const authFilesRef = ref(storage, `whatsapp-auth/${botId}`);
      await deleteObject(authFilesRef);
    } catch (error) {
      console.error(`Error cleaning up auth files for bot ${botId}:`, error);
    }
  }

  getBot(botId: string): WhatsAppBot | undefined {
    return this.bots.get(botId);
  }

  getAllBots(): WhatsAppBot[] {
    return Array.from(this.bots.values());
  }
}

const whatsappService = new WhatsAppService();

export async function POST(request: NextRequest) {
  try {
    const { botId, action } = await request.json();

    if (!botId) {
      return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 });
    }

    switch (action) {
      case 'create':
        await whatsappService.createBot(botId);
        return NextResponse.json({ success: true, message: 'Bot created successfully' });

      case 'connect':
        const result = await whatsappService.connectBot(botId);
        return NextResponse.json({ success: true, ...result });

      case 'disconnect':
        await whatsappService.disconnectBot(botId);
        return NextResponse.json({ success: true, message: 'Bot disconnected successfully' });

      case 'delete':
        await whatsappService.deleteBot(botId);
        return NextResponse.json({ success: true, message: 'Bot deleted successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('WhatsApp API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const botId = searchParams.get('botId');

    if (botId) {
      const bot = whatsappService.getBot(botId);
      if (!bot) {
        return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, bot });
    } else {
      const allBots = whatsappService.getAllBots();
      return NextResponse.json({ success: true, bots: allBots });
    }
  } catch (error) {
    console.error('WhatsApp API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
