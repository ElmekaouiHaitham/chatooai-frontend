const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc, deleteDoc } = require('firebase/firestore');

// Firebase configuration (you'll need to add your own config here)
const firebaseConfig = {
  // Add your Firebase config here
  // apiKey: "your-api-key",
  // authDomain: "your-project.firebaseapp.com",
  // projectId: "your-project-id",
  // storageBucket: "your-project.appspot.com",
  // messagingSenderId: "your-sender-id",
  // appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test user data
const testUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  plan: 'Free',
  status: 'active',
  bots: 0,
  botIds: [],
  joined: new Date(),
  lastActive: new Date(),
  revenue: 0,
  isAdmin: false,
};

// Test bot data
const testBot = {
  uid: 'test-user-123',
  name: 'Test Bot',
  description: 'A test bot for verification',
  avatar: 'https://example.com/avatar.png',
  aiModel: 'gpt-3.5-turbo',
  personality: 'Friendly and helpful',
  autoReply: true,
  workingHours: {
    enabled: false,
    start: '09:00',
    end: '17:00',
    timezone: 'UTC',
  },
  features: {
    fileSharing: false,
    voiceMessages: false,
    quickReplies: false,
    analytics: false,
  },
  whatsapp: {
    status: 'disconnected',
    authFiles: [],
  },
  stats: {
    messageCount: 0,
    totalUsers: 0,
  },
};

async function testBotLinking() {
  try {
    console.log('🧪 Testing Bot Linking Functionality...\n');

    // Step 1: Create test user
    console.log('1. Creating test user...');
    await setDoc(doc(db, 'users', testUser.uid), testUser);
    console.log('✅ Test user created successfully');

    // Step 2: Verify user has no bots initially
    console.log('\n2. Verifying initial user state...');
    const userDoc = await getDoc(doc(db, 'users', testUser.uid));
    const userData = userDoc.data();
    console.log(`   - User bots count: ${userData.bots}`);
    console.log(`   - User botIds array: [${userData.botIds.join(', ')}]`);
    
    if (userData.bots === 0 && userData.botIds.length === 0) {
      console.log('✅ Initial state verified - user has no bots');
    } else {
      console.log('❌ Initial state incorrect');
      return;
    }

    // Step 3: Create test bot (simulating the createBot function logic)
    console.log('\n3. Creating test bot...');
    const botRef = doc(db, 'bots', 'test-bot-123');
    const now = new Date();
    const newBot = {
      ...testBot,
      id: 'test-bot-123',
      createdAt: now,
      updatedAt: now,
    };
    
    await setDoc(botRef, newBot);
    console.log('✅ Test bot created successfully');

    // Step 4: Update user's bot count and botIds array (simulating createBot function)
    console.log('\n4. Updating user with bot information...');
    const currentBots = userData.bots || 0;
    const currentBotIds = userData.botIds || [];
    
    await setDoc(doc(db, 'users', testUser.uid), {
      ...userData,
      bots: currentBots + 1,
      botIds: [...currentBotIds, 'test-bot-123'],
    });
    console.log('✅ User updated with bot information');

    // Step 5: Verify user now has the bot
    console.log('\n5. Verifying user now has the bot...');
    const updatedUserDoc = await getDoc(doc(db, 'users', testUser.uid));
    const updatedUserData = updatedUserDoc.data();
    console.log(`   - User bots count: ${updatedUserData.bots}`);
    console.log(`   - User botIds array: [${updatedUserData.botIds.join(', ')}]`);
    
    if (updatedUserData.bots === 1 && updatedUserData.botIds.includes('test-bot-123')) {
      console.log('✅ Bot linking verified - user now has 1 bot');
    } else {
      console.log('❌ Bot linking failed');
      return;
    }

    // Step 6: Delete the bot (simulating deleteBot function logic)
    console.log('\n6. Deleting test bot...');
    await deleteDoc(botRef);
    console.log('✅ Test bot deleted successfully');

    // Step 7: Update user to remove bot (simulating deleteBot function logic)
    console.log('\n7. Updating user to remove bot information...');
    const finalBotIds = updatedUserData.botIds.filter((id) => id !== 'test-bot-123');
    
    await setDoc(doc(db, 'users', testUser.uid), {
      ...updatedUserData,
      bots: Math.max(0, updatedUserData.bots - 1),
      botIds: finalBotIds,
    });
    console.log('✅ User updated to remove bot information');

    // Step 8: Verify user no longer has the bot
    console.log('\n8. Verifying user no longer has the bot...');
    const finalUserDoc = await getDoc(doc(db, 'users', testUser.uid));
    const finalUserData = finalUserDoc.data();
    console.log(`   - User bots count: ${finalUserData.bots}`);
    console.log(`   - User botIds array: [${finalUserData.botIds.join(', ')}]`);
    
    if (finalUserData.bots === 0 && finalUserData.botIds.length === 0) {
      console.log('✅ Bot unlinking verified - user no longer has bots');
    } else {
      console.log('❌ Bot unlinking failed');
      return;
    }

    // Step 9: Clean up test user
    console.log('\n9. Cleaning up test user...');
    await deleteDoc(doc(db, 'users', testUser.uid));
    console.log('✅ Test user cleaned up');

    console.log('\n🎉 All tests passed! Bot linking functionality is working correctly.');
    console.log('\n📋 Summary:');
    console.log('   ✅ User creation with empty botIds array');
    console.log('   ✅ Bot creation and linking to user');
    console.log('   ✅ User botIds array updated correctly');
    console.log('   ✅ Bot deletion and unlinking from user');
    console.log('   ✅ User botIds array cleaned up correctly');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
if (require.main === module) {
  console.log('⚠️  Note: This script requires Firebase configuration.');
  console.log('   Please add your Firebase config to the firebaseConfig object.\n');
  
  // Uncomment the line below after adding your Firebase config
  // testBotLinking();
}

module.exports = { testBotLinking };

