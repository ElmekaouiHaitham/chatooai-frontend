import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSOYzR0SzGI_sszKDOBYPaLX5_ZLWPMeI",
  authDomain: "chatooai.firebaseapp.com",
  projectId: "chatooai",
  storageBucket: "chatooai.firebasestorage.app",
  messagingSenderId: "730182896787",
  appId: "1:730182896787:web:253231731b29f8f9ced166",
  measurementId: "G-54BM5SJ57L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Get the current user's Firebase Auth ID token (for backend API requests)
export const getCurrentUserToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return await currentUser.getIdToken();
};

// Authentication functions
export const signInWithGoogle = async (planId?: string) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Create user document in Firestore if it doesn't exist
    await createUserDocument(
      result.user,
      result.user.displayName || undefined,
      planId
    );

    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string,
  planId?: string
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }

    // Create user document in Firestore with selected plan
    await createUserDocument(result.user, displayName, planId);

    return result.user;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Update last active time
    await updateUserLastActive(result.user.uid);

    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// User management functions
export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  plan?: string;
  planId?: string | null;
  status?: "active" | "suspended" | "inactive";
  bots?: number;
  botIds?: string[]; // Array of bot IDs owned by this user
  joined?: Timestamp;
  lastActive?: Timestamp;
  revenue?: number;
  isAdmin?: boolean;
  totalMessages?: number;
  monthlyUsage?: Array<{
    month: number; // 1-12
    year: number;
    bots: number;
    messages: number;
    startDate: Timestamp;
    endDate: Timestamp;
  }>;
}

export interface PlanData {
  id: string;
  name: string;
  description?: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  status: "active" | "inactive" | "draft";
  features: string[];
  limits: {
    botsPerMonth: number;
    messagesPerMonth: number;
  };
  isPopular?: boolean;
  isUnlimited?: boolean;
  users: number;
  revenue: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface BotData {
  id: string;
  uid: string; // User ID who owns this bot
  name: string;
  description: string;
  aiModel: string;
  personality: string;
  autoReply: boolean;
  whatsapp: {
    phoneNumber?: string;
    status: "disconnected" | "connected" | "error";
    qrCode?: string;
    lastConnected?: Timestamp;
    authFiles?: string[]; // Firebase Storage URLs
  };
  stats: {
    messageCount: number;
    lastActive?: Timestamp;
    totalUsers: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Fetch all bots in the system
export const getAllBots = async (): Promise<BotData[]> => {
  try {
    const botsRef = collection(db, "bots");
    const q = query(botsRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    const bots: BotData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bots.push({
        id: doc.id,
        uid: data.uid || "",
        name: data.name || "Unnamed Bot",
        description: data.description || "",
        aiModel: data.aiModel || "gpt-3.5-turbo",
        personality: data.personality || "Friendly and helpful",
        autoReply: data.autoReply || false,
        whatsapp: data.whatsapp || {
          phoneNumber: undefined,
          status: "disconnected",
          qrCode: undefined,
          lastConnected: undefined,
          authFiles: [],
        },
        stats: data.stats || {
          messageCount: 0,
          lastActive: undefined,
          totalUsers: 0,
        },
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
      });
    });
    return bots;
  } catch (error) {
    console.error("Error fetching all bots:", error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("joined", "desc"));
    const querySnapshot = await getDocs(q);

    const users: UserData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        email: data.email || "",
        displayName: data.displayName || "",
        photoURL: data.photoURL || "",
        plan: data.plan || "Free",
        status: data.status || "active",
        bots: data.bots || 0,
        botIds: data.botIds || [], // Include bot IDs array
        joined: data.joined,
        lastActive: data.lastActive,
        revenue: data.revenue || 0,
        isAdmin: data.isAdmin || false,
        totalMessages: data.totalMessages || 0,
        monthlyUsage: data.monthlyUsage || [],
      });
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid: userDoc.id,
        email: data.email || "",
        displayName: data.displayName || "",
        photoURL: data.photoURL || "",
        plan: data.plan || "Free",
        planId: data.planId || null,
        status: data.status || "active",
        bots: data.bots || 0,
        botIds: data.botIds || [], // Include bot IDs array
        joined: data.joined,
        lastActive: data.lastActive,
        revenue: data.revenue || 0,
        isAdmin: data.isAdmin || false,
        totalMessages: data.totalMessages || 0,
        monthlyUsage: data.monthlyUsage || [],
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUserStatus = async (
  uid: string,
  status: "active" | "suspended" | "inactive"
): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { status });
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

export const updateUserPlan = async (
  uid: string,
  plan: string
): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { plan });
  } catch (error) {
    console.error("Error updating user plan:", error);
    throw error;
  }
};

export const updateCurrentUserPlan = async (planId: string): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No authenticated user found");
    }

    // Get plan details
    const planDoc = await getDoc(doc(db, "plans", planId));
    if (!planDoc.exists()) {
      throw new Error("Plan not found");
    }

    const planData = planDoc.data();
    const userRef = doc(db, "users", currentUser.uid);

    // Update both plan name and planId
    await updateDoc(userRef, {
      plan: planData.name,
      planId: planId,
    });

    // Increment user count and revenue for the plan
    const planRef = doc(db, "plans", planId);
    await updateDoc(planRef, {
      users: (planData.users || 0) + 1,
      revenue: (planData.revenue || 0) + planData.price,
    });
  } catch (error) {
    console.error("Error updating current user plan:", error);
    throw error;
  }
};

export const updateCurrentUserDisplayName = async (
  displayName: string
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No authenticated user found");
    }

    // Update Firebase Auth profile
    await updateProfile(currentUser, { displayName });

    // Update Firestore document
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, { displayName });
  } catch (error) {
    console.error("Error updating current user display name:", error);
    throw error;
  }
};

export const getCurrentUserData = async (): Promise<UserData | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }

    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();
    return {
      uid: userDoc.id,
      email: data.email || "",
      displayName: data.displayName || "",
      photoURL: data.photoURL || "",
      plan: data.plan || "Free",
      planId: data.planId || null,
      status: data.status || "active",
      bots: data.bots || 0,
      botIds: data.botIds || [], // Include bot IDs array
      joined: data.joined,
      lastActive: data.lastActive,
      revenue: data.revenue || 0,
      isAdmin: data.isAdmin || false,
      totalMessages: data.totalMessages || 0,
      monthlyUsage: data.monthlyUsage || [],
    };
  } catch (error) {
    console.error("Error fetching current user data:", error);
    throw error;
  }
};

export const updateUserLastActive = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { lastActive: Timestamp.now() });
  } catch (error) {
    console.error("Error updating user last active:", error);
    // Don't throw error here as it shouldn't prevent sign in
  }
};

export const deleteUser = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const getUsersByStatus = async (status: string): Promise<UserData[]> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("status", "==", status),
      orderBy("joined", "desc")
    );
    const querySnapshot = await getDocs(q);

    const users: UserData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        email: data.email || "",
        displayName: data.displayName || "",
        photoURL: data.photoURL || "",
        plan: data.plan || "Free",
        status: data.status || "active",
        bots: data.bots || 0,
        botIds: data.botIds || [], // Include bot IDs array
        joined: data.joined,
        lastActive: data.lastActive,
        revenue: data.revenue || 0,
        isAdmin: data.isAdmin || false,
        totalMessages: data.totalMessages || 0,
        monthlyUsage: data.monthlyUsage || [],
      });
    });

    return users;
  } catch (error) {
    console.error("Error fetching users by status:", error);
    throw error;
  }
};

// Function to create an admin user (for testing purposes)
export const createAdminUser = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { isAdmin: true });
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
};

// Helper function to create user document in Firestore
const createUserDocument = async (
  user: User,
  displayName?: string,
  planId?: string
) => {
  try {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Get plan details if planId is provided
      let planName = "Free";
      if (planId) {
        try {
          const planDoc = await getDoc(doc(db, "plans", planId));
          if (planDoc.exists()) {
            const planData = planDoc.data();
            planName = planData.name;

            // Increment user count and revenue for the plan
            const planRef = doc(db, "plans", planId);
            await updateDoc(planRef, {
              users: (planData.users || 0) + 1,
              revenue: (planData.revenue || 0) + planData.price,
            });
          }
        } catch (error) {
          console.error("Error fetching plan details:", error);
          // Fallback to Free plan if there's an error
        }
      }

      // Create new user document
      // Calculate start and end of the current month for monthlyUsage
      const now = new Date();
      const startDate = Timestamp.now();
      // End of period: set to 30 days after startDate
      const endDate = Timestamp.fromDate(
        new Date(startDate.toDate().getTime() + 30 * 24 * 60 * 60 * 1000)
      );
      await setDoc(userRef, {
        email: user.email,
        displayName: displayName || user.displayName || "",
        photoURL: user.photoURL || "",
        plan: planName,
        planId: planId || null,
        status: "active",
        bots: 0,
        botIds: [], // Initialize empty array for bot IDs
        joined: startDate,
        lastActive: startDate,
        revenue: 0,
        isAdmin: false,
        totalMessages: 0,
        monthlyUsage: [
          {
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            bots: 0,
            messages: 0,
            startDate,
            endDate,
          },
        ],
      });
    } else {
      // Update last active time
      await updateDoc(userRef, {
        lastActive: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error creating user document:", error);
    // Don't throw error here as it shouldn't prevent sign up/sign in
  }
};

// Plan Management Functions
export const getAllPlans = async (): Promise<PlanData[]> => {
  try {
    const plansRef = collection(db, "plans");
    const plansSnapshot = await getDocs(plansRef);
    const plans: PlanData[] = [];

    plansSnapshot.forEach((doc) => {
      plans.push({
        id: doc.id,
        ...doc.data(),
      } as PlanData);
    });

    return plans;
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
};

export const getPlanById = async (planId: string): Promise<PlanData | null> => {
  try {
    const planRef = doc(db, "plans", planId);
    const planDoc = await getDoc(planRef);

    if (planDoc.exists()) {
      return {
        id: planDoc.id,
        ...planDoc.data(),
      } as PlanData;
    }

    return null;
  } catch (error) {
    console.error("Error fetching plan:", error);
    throw error;
  }
};

export const createPlan = async (
  planData: Omit<PlanData, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const plansRef = collection(db, "plans");
    const newPlanRef = doc(plansRef);

    const planWithTimestamps = {
      ...planData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(newPlanRef, planWithTimestamps);
    return newPlanRef.id;
  } catch (error) {
    console.error("Error creating plan:", error);
    throw error;
  }
};

export const updatePlan = async (
  planId: string,
  planData: Partial<PlanData>
): Promise<void> => {
  try {
    const planRef = doc(db, "plans", planId);

    const updateData = {
      ...planData,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(planRef, updateData);
  } catch (error) {
    console.error("Error updating plan:", error);
    throw error;
  }
};

export const deletePlan = async (planId: string): Promise<void> => {
  try {
    const planRef = doc(db, "plans", planId);
    await deleteDoc(planRef);
  } catch (error) {
    console.error("Error deleting plan:", error);
    throw error;
  }
};

export const getPlansByStatus = async (status: string): Promise<PlanData[]> => {
  try {
    const plansRef = collection(db, "plans");
    const q = query(plansRef, where("status", "==", status));
    const querySnapshot = await getDocs(q);

    const plans: PlanData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      plans.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        billingCycle: data.billingCycle,
        status: data.status,
        features: data.features,
        limits: {
          botsPerMonth: data.limits?.botsPerMonth ?? data.limits?.bots ?? 0,
          messagesPerMonth:
            data.limits?.messagesPerMonth ?? data.limits?.messagesPerDay ?? 0,
        },
        isPopular: data.isPopular,
        isUnlimited: data.isUnlimited,
        users: data.users,
        revenue: data.revenue,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return plans;
  } catch (error) {
    console.error("Error fetching plans by status:", error);
    throw error;
  }
};

// Bot Management Functions
export const ensureBotsCollection = async (): Promise<void> => {
  try {
    // Try to get a document from the bots collection to see if it exists
    const botsRef = collection(db, "bots");
    const testQuery = query(botsRef, limit(1));
    await getDocs(testQuery);
  } catch (error) {
    console.log(
      "Bots collection may not exist yet, this is normal for new users"
    );
  }
};

export const testFirestoreAccess = async (): Promise<boolean> => {
  try {
    // Try to access a simple collection to test Firestore access
    const testRef = collection(db, "users");
    const testQuery = query(testRef, limit(1));
    await getDocs(testQuery);
    console.log("Firestore access test successful");
    return true;
  } catch (error) {
    console.error("Firestore access test failed:", error);
    return false;
  }
};

export const createBot = async (
  botData: Omit<BotData, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const botRef = doc(collection(db, "bots"));
    const now = Timestamp.now();

    const newBot = {
      ...botData,
      id: botRef.id,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(botRef, newBot);

    // Update user's bot count, add bot ID, and increment current month's bots in monthlyUsage
    const userRef = doc(db, "users", botData.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentBots = userData.bots || 0;
      const currentBotIds = userData.botIds || [];
      let monthlyUsage = userData.monthlyUsage || [];
      // Find the current month entry
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      let found = false;
      monthlyUsage = monthlyUsage.map((entry: any) => {
        if (entry.month === month && entry.year === year) {
          found = true;
          // Prefer botsPerMonth if present, else fallback to bots
          if (typeof entry.botsPerMonth === "number") {
            return { ...entry, botsPerMonth: entry.botsPerMonth + 1 };
          } else {
            return { ...entry, bots: (entry.bots || 0) + 1 };
          }
        }
        return entry;
      });
      if (!found) {
        // If no entry for this month, add one
        const startDate = Timestamp.now();
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
        const endDate = Timestamp.fromDate(endOfMonth);
        monthlyUsage.push({
          month,
          year,
          bots: 0,
          botsPerMonth: 1,
          messages: 0,
          startDate,
          endDate,
        });
      }
      await updateDoc(userRef, {
        bots: currentBots + 1,
        botIds: [...currentBotIds, botRef.id],
        monthlyUsage,
      });
    }

    return botRef.id;
  } catch (error) {
    console.error("Error creating bot:", error);
    throw error;
  }
};

export const getUserBots = async (uid: string): Promise<BotData[]> => {
  try {
    // Ensure the bots collection exists
    await ensureBotsCollection();
    console.log(`Fetching bots for user: ${uid}`);
    const botsRef = collection(db, "bots");
    const q = query(
      botsRef,
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const bots: BotData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bots.push({
        id: doc.id,
        uid: data.uid || "",
        name: data.name || "Unnamed Bot",
        description: data.description || "",
        aiModel: data.aiModel || "gpt-3.5-turbo",
        personality: data.personality || "Friendly and helpful",
        autoReply: data.autoReply || false,
        whatsapp: data.whatsapp || {
          phoneNumber: undefined,
          status: "disconnected",
          qrCode: undefined,
          lastConnected: undefined,
          authFiles: [],
        },
        stats: data.stats || {
          messageCount: 0,
          lastActive: undefined,
          totalUsers: 0,
        },
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
      });
    });

    return bots;
  } catch (error) {
    console.error("Error fetching user bots:", error);

    // If it's a collection doesn't exist error or permission error, return empty array
    if (
      error instanceof Error &&
      (error.message.includes("collection") ||
        error.message.includes("permission-denied") ||
        error.message.includes("not-found"))
    ) {
      console.log(
        "Bots collection issue, returning empty array:",
        error.message
      );
      return [];
    }

    // For other errors, throw them
    throw error;
  }
};

export const getBotById = async (botId: string): Promise<BotData | null> => {
  try {
    const botRef = doc(db, "bots", botId);
    const botDoc = await getDoc(botRef);

    if (botDoc.exists()) {
      const data = botDoc.data();
      return {
        id: botDoc.id,
        uid: data.uid,
        name: data.name,
        description: data.description,
        aiModel: data.aiModel,
        personality: data.personality,
        autoReply: data.autoReply,
        whatsapp: data.whatsapp,
        stats: data.stats,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching bot:", error);
    throw error;
  }
};

export const updateBot = async (
  botId: string,
  updates: Partial<BotData>
): Promise<void> => {
  try {
    const botRef = doc(db, "bots", botId);
    await updateDoc(botRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating bot:", error);
    throw error;
  }
};

export const deleteBot = async (botId: string, uid: string): Promise<void> => {
  try {
    const botRef = doc(db, "bots", botId);
    await deleteDoc(botRef);

    // Update user's bot count and remove bot ID from botIds array
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const currentBots = userDoc.data().bots || 0;
      const currentBotIds = userDoc.data().botIds || [];
      const updatedBotIds = currentBotIds.filter((id: string) => id !== botId); // Remove bot ID from array
      await updateDoc(userRef, {
        bots: Math.max(0, currentBots - 1),
        botIds: updatedBotIds,
      });
    }
  } catch (error) {
    console.error("Error deleting bot:", error);
    throw error;
  }
};

export const updateBotWhatsAppStatus = async (
  botId: string,
  status: BotData["whatsapp"]["status"],
  qrCode?: string
): Promise<void> => {
  try {
    const botRef = doc(db, "bots", botId);
    const updates: any = {
      "whatsapp.status": status,
      updatedAt: Timestamp.now(),
    };

    if (status === "connected") {
      updates["whatsapp.lastConnected"] = Timestamp.now();
      updates["whatsapp.qrCode"] = null;
    } else if (qrCode) {
      updates["whatsapp.qrCode"] = qrCode;
    }

    await updateDoc(botRef, updates);
  } catch (error) {
    console.error("Error updating bot WhatsApp status:", error);
    throw error;
  }
};

export const updateBotStats = async (
  botId: string,
  stats: Partial<BotData["stats"]>
): Promise<void> => {
  try {
    const botRef = doc(db, "bots", botId);
    await updateDoc(botRef, {
      ...Object.fromEntries(
        Object.entries(stats).map(([key, value]) => [`stats.${key}`, value])
      ),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating bot stats:", error);
    throw error;
  }
};

export default app;
