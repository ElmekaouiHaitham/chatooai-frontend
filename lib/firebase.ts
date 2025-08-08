import { initializeApp } from 'firebase/app';
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
  updateProfile
} from 'firebase/auth';
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
  Timestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSOYzR0SzGI_sszKDOBYPaLX5_ZLWPMeI",
  authDomain: "chatooai.firebaseapp.com",
  projectId: "chatooai",
  storageBucket: "chatooai.firebasestorage.app",
  messagingSenderId: "730182896787",
  appId: "1:730182896787:web:253231731b29f8f9ced166",
  measurementId: "G-54BM5SJ57L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Create user document in Firestore if it doesn't exist
    await createUserDocument(result.user, result.user.displayName || undefined);
    
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    
    // Create user document in Firestore
    await createUserDocument(result.user, displayName);
    
    return result.user;
  } catch (error) {
    console.error('Error signing up with email:', error);
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
    console.error('Error signing in with email:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
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
  status?: 'active' | 'suspended' | 'inactive';
  bots?: number;
  joined?: Timestamp;
  lastActive?: Timestamp;
  revenue?: number;
  isAdmin?: boolean;
}

export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('joined', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const users: UserData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || '',
        plan: data.plan || 'Free',
        status: data.status || 'active',
        bots: data.bots || 0,
        joined: data.joined,
        lastActive: data.lastActive,
        revenue: data.revenue || 0,
        isAdmin: data.isAdmin || false,
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid: userDoc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || '',
        plan: data.plan || 'Free',
        status: data.status || 'active',
        bots: data.bots || 0,
        joined: data.joined,
        lastActive: data.lastActive,
        revenue: data.revenue || 0,
        isAdmin: data.isAdmin || false,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUserStatus = async (uid: string, status: 'active' | 'suspended' | 'inactive'): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { status });
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const updateUserPlan = async (uid: string, plan: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { plan });
  } catch (error) {
    console.error('Error updating user plan:', error);
    throw error;
  }
};

export const updateUserLastActive = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { lastActive: Timestamp.now() });
  } catch (error) {
    console.error('Error updating user last active:', error);
    // Don't throw error here as it shouldn't prevent sign in
  }
};

export const deleteUser = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getUsersByStatus = async (status: string): Promise<UserData[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('status', '==', status), orderBy('joined', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const users: UserData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || '',
        plan: data.plan || 'Free',
        status: data.status || 'active',
        bots: data.bots || 0,
        joined: data.joined,
        lastActive: data.lastActive,
        revenue: data.revenue || 0,
        isAdmin: data.isAdmin || false,
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users by status:', error);
    throw error;
  }
};

// Function to create an admin user (for testing purposes)
export const createAdminUser = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { isAdmin: true });
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

// Helper function to create user document in Firestore
const createUserDocument = async (user: User, displayName?: string) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(userRef, {
        email: user.email,
        displayName: displayName || user.displayName || '',
        photoURL: user.photoURL || '',
        plan: 'Free',
        status: 'active',
        bots: 0,
        joined: Timestamp.now(),
        lastActive: Timestamp.now(),
        revenue: 0,
        isAdmin: false,
      });
    } else {
      // Update last active time
      await updateDoc(userRef, {
        lastActive: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    // Don't throw error here as it shouldn't prevent sign up/sign in
  }
};

export default app; 