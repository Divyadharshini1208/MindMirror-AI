/**
 * MirrorMind AI — Authentication & Persistence Service
 *
 * Firebase Authentication is the primary authentication engine:
 * - Google Sign-In via GoogleAuthProvider & signInWithPopup
 * - Email / Password Registration & Login
 * - Password Reset via sendPasswordResetEmail
 * - Persistent Auth State via onAuthStateChanged
 * - Real Firestore syncing for user reflections
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim(),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim(),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim(),
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey.length > 5
);

let firebaseAuthInstance = null;
let firebaseAppInstance = null;
let firestoreDbInstance = null;
let googleAuthProvider = null;

if (isFirebaseConfigured) {
  try {
    firebaseAppInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    firebaseAuthInstance = getAuth(firebaseAppInstance);

    // Initialize official Google Auth Provider
    googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({
      prompt: 'select_account',
    });

    try {
      firestoreDbInstance = getFirestore(firebaseAppInstance);
    } catch (fsErr) {
      console.warn('Firestore initialization error:', fsErr);
      firestoreDbInstance = null;
    }

    // Initialize Google Analytics safely if supported
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && firebaseAppInstance) {
          getAnalytics(firebaseAppInstance);
        }
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
    firebaseAuthInstance = null;
  }
}

// --------------------------------------------------------------------------
// Session State & Local Listeners
// --------------------------------------------------------------------------
const USERS_STORAGE_KEY = 'mirrormind_registered_users';
const SESSION_STORAGE_KEY = 'mirrormind_active_session';
const authListeners = new Set();

/**
 * Normalizes a Firebase User into a uniform MirrorMind User object
 */
export function formatFirebaseUser(fbUser) {
  if (!fbUser) return null;
  const isGoogle = fbUser.providerData?.some(
    (p) => p.providerId === 'google.com' || p.providerId === GoogleAuthProvider.PROVIDER_ID
  );

  return {
    id: fbUser.uid,
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'MirrorMind Explorer'),
    photoURL: fbUser.photoURL || null,
    providerId: isGoogle ? 'google.com' : (fbUser.providerData?.[0]?.providerId || 'password'),
    isGoogleUser: Boolean(isGoogle),
    emailVerified: fbUser.emailVerified || false,
    createdAt: fbUser.metadata?.creationTime || new Date().toISOString(),
    lastLoginAt: fbUser.metadata?.lastSignInTime || new Date().toISOString(),
  };
}

/**
 * Computes a secure SHA-256 hash with salt using the browser's Web Crypto API
 * for local fallback when Firebase is offline.
 */
async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:mirrormind_salt_2026`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Could not save user locally:', e);
  }
}

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredSession(user) {
  if (user) {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Could not set session storage:', e);
    }
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
  notifyAuthListeners(user);
}

function notifyAuthListeners(user) {
  for (const listener of authListeners) {
    try {
      listener(user);
    } catch (e) {
      console.error('Error in auth listener:', e);
    }
  }
}

// --------------------------------------------------------------------------
// Public Authentication Methods
// --------------------------------------------------------------------------

/**
 * Sign in with Google using Firebase Authentication popup flow.
 * Official GoogleAuthProvider handles OAuth, profile photo, display name, and email.
 */
export async function loginWithGoogle() {
  if (!firebaseAuthInstance) {
    throw new Error('Firebase Authentication is not configured or available. Please verify your environment variables.');
  }

  try {
    const provider = googleAuthProvider || new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await signInWithPopup(firebaseAuthInstance, provider);
    const user = formatFirebaseUser(userCredential.user);
    setStoredSession(user);
    return user;
  } catch (err) {
    console.error('Firebase Google Sign-in error:', err);

    if (err.code === 'auth/popup-closed-by-user') {
      throw new Error('Google Sign-In was cancelled or the popup was closed before completion.');
    } else if (err.code === 'auth/popup-blocked') {
      throw new Error('Google Sign-In popup was blocked by your browser. Please allow popups for this site and try again.');
    } else if (err.code === 'auth/cancelled-popup-request') {
      throw new Error('Previous Google Sign-In request was cancelled.');
    } else if (err.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account already exists with this email using a different sign-in method.');
    } else if (err.code === 'auth/network-request-failed') {
      throw new Error('Network connection failed. Please check your internet connection.');
    } else if (err.code === 'auth/unauthorized-domain') {
      throw new Error('Current domain is not authorized in Firebase OAuth settings.');
    }

    throw new Error(err.message || 'Google Sign-In failed. Please try again.');
  }
}

/**
 * Register a new user account with Email and Password.
 * Supports both object payload `{ fullName, email, password, confirmPassword }`
 * and positional parameters `(email, password, fullName)`.
 */
export async function registerUser(arg1, arg2, arg3) {
  let fullName, email, password, confirmPassword;

  if (typeof arg1 === 'object' && arg1 !== null) {
    fullName = arg1.fullName || arg1.name;
    email = arg1.email;
    password = arg1.password;
    confirmPassword = arg1.confirmPassword ?? arg1.password;
  } else {
    email = arg1;
    password = arg2;
    fullName = arg3;
    confirmPassword = arg2;
  }

  const name = (fullName || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!name || name.length < 2) {
    throw new Error('Please enter your full name (minimum 2 characters).');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  if (confirmPassword && password !== confirmPassword) {
    throw new Error('Passwords do not match. Please verify your entries.');
  }

  // 1. Firebase Authentication Flow
  if (firebaseAuthInstance) {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuthInstance, cleanEmail, password);
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      const user = formatFirebaseUser({
        ...userCredential.user,
        displayName: name || userCredential.user.displayName,
      });
      setStoredSession(user);
      return user;
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      throw new Error(err.message || 'Registration failed. Please try again.');
    }
  }

  // 2. Cryptographic Local Storage Fallback
  const users = getStoredUsers();
  const existing = users.find((u) => u.email === cleanEmail);
  if (existing) {
    throw new Error('An account with this email address already exists. Please sign in.');
  }

  const salt = crypto.randomUUID();
  const passwordHash = await hashPassword(password, salt);

  const newUser = {
    id: `usr_${crypto.randomUUID().slice(0, 8)}`,
    uid: `usr_${crypto.randomUUID().slice(0, 8)}`,
    displayName: name,
    email: cleanEmail,
    photoURL: null,
    providerId: 'password',
    isGoogleUser: false,
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveStoredUsers(users);

  const sessionUser = {
    id: newUser.id,
    uid: newUser.uid,
    displayName: newUser.displayName,
    email: newUser.email,
    photoURL: null,
    providerId: 'password',
    isGoogleUser: false,
    createdAt: newUser.createdAt,
  };

  setStoredSession(sessionUser);
  return sessionUser;
}

/**
 * Log in an existing user with Email and Password.
 * Supports both object payload `{ email, password }` and positional `(email, password)`.
 */
export async function loginUser(arg1, arg2) {
  let email, password;

  if (typeof arg1 === 'object' && arg1 !== null) {
    email = arg1.email;
    password = arg1.password;
  } else {
    email = arg1;
    password = arg2;
  }

  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error('Please enter your email address.');
  }

  if (!password) {
    throw new Error('Please enter your password.');
  }

  // 1. Firebase Authentication Flow
  if (firebaseAuthInstance) {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuthInstance, cleanEmail, password);
      const user = formatFirebaseUser(userCredential.user);
      setStoredSession(user);
      return user;
    } catch (err) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        throw new Error('Invalid email or password. Please verify your credentials and try again.');
      } else if (err.code === 'auth/too-many-requests') {
        throw new Error('Access to this account has been temporarily disabled due to many failed login attempts. Try again later.');
      }
      throw new Error(err.message || 'Login failed.');
    }
  }

  // 2. Cryptographic Local Storage Fallback
  const users = getStoredUsers();
  const userRecord = users.find((u) => u.email === cleanEmail);

  if (!userRecord) {
    throw new Error('No account found with this email. Please create an account.');
  }

  const computedHash = await hashPassword(password, userRecord.salt);
  if (computedHash !== userRecord.passwordHash) {
    throw new Error('Incorrect password. Please verify and try again.');
  }

  const sessionUser = {
    id: userRecord.id,
    uid: userRecord.uid || userRecord.id,
    displayName: userRecord.displayName,
    email: userRecord.email,
    photoURL: null,
    providerId: 'password',
    isGoogleUser: false,
    createdAt: userRecord.createdAt,
  };

  setStoredSession(sessionUser);
  return sessionUser;
}

/**
 * Sends a password reset email using Firebase Authentication.
 */
export async function resetPassword(email) {
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error('Please enter your email address to receive password reset instructions.');
  }

  if (firebaseAuthInstance) {
    try {
      await sendPasswordResetEmail(firebaseAuthInstance, cleanEmail);
      return true;
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        throw new Error('No registered account was found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      throw new Error(err.message || 'Failed to send password reset email.');
    }
  }

  throw new Error('Password reset requires active Firebase Authentication connectivity.');
}

/**
 * Log out active user session and clear local credentials.
 */
export async function logoutUser() {
  if (firebaseAuthInstance) {
    try {
      await firebaseSignOut(firebaseAuthInstance);
    } catch (e) {
      console.warn('Firebase signout notice:', e);
    }
  }
  setStoredSession(null);
}

/**
 * Get current session user synchronously.
 */
export function getCurrentUser() {
  if (firebaseAuthInstance && firebaseAuthInstance.currentUser) {
    return formatFirebaseUser(firebaseAuthInstance.currentUser);
  }
  return getStoredSession();
}

/**
 * Subscribe to authentication state changes.
 * Preserves user state across page reloads via Firebase.
 */
export function onAuthStateChanged(callback) {
  if (firebaseAuthInstance) {
    return firebaseOnAuthStateChanged(firebaseAuthInstance, (fbUser) => {
      if (fbUser) {
        const user = formatFirebaseUser(fbUser);
        setStoredSession(user);
        callback(user);
      } else {
        setStoredSession(null);
        callback(null);
      }
    });
  }

  authListeners.add(callback);
  callback(getStoredSession());

  return () => {
    authListeners.delete(callback);
  };
}

// --------------------------------------------------------------------------
// Reflection History Management (Firestore + User-specific storage)
// --------------------------------------------------------------------------

/**
 * Retrieves reflections for a user from local cache.
 */
export function getUserReflections(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`mirrormind_reflections_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Syncs reflections from Firestore into local cache.
 */
export async function syncFirestoreReflections(userId, callback) {
  if (!userId || !firestoreDbInstance) return;

  try {
    const reflectionsCol = collection(firestoreDbInstance, `users/${userId}/reflections`);
    const q = query(reflectionsCol, where('uid', '==', userId));
    const querySnapshot = await getDocs(q);

    const items = [];
    querySnapshot.forEach((d) => {
      items.push({ id: d.id, ...d.data() });
    });

    items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (items.length > 0) {
      localStorage.setItem(`mirrormind_reflections_${userId}`, JSON.stringify(items.slice(0, 50)));
      if (callback) callback(items);
    }
  } catch (err) {
    console.warn('Could not sync reflections from Firestore (using local storage):', err);
  }
}

/**
 * Saves a prediction reflection to local cache and Firestore.
 */
export function saveUserReflection(userId, reflection) {
  if (!userId || !reflection) return [];

  const existing = getUserReflections(userId);
  const cleanRecord = {
    id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    uid: userId,
    modality: reflection.modality || 'TEXT',
    emotion: reflection.emotion,
    confidence: reflection.confidence,
    distribution: reflection.distribution || [],
    modelName: reflection.modelName || null,
    timestamp: reflection.timestamp || new Date().toISOString(),
  };

  const updated = [cleanRecord, ...existing];

  try {
    localStorage.setItem(`mirrormind_reflections_${userId}`, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.warn('Could not save reflection to localStorage:', e);
  }

  if (firestoreDbInstance) {
    try {
      const colRef = collection(firestoreDbInstance, `users/${userId}/reflections`);
      addDoc(colRef, cleanRecord).catch((err) => {
        console.warn('Firestore write notice:', err);
      });
    } catch (e) {
      console.warn('Firestore error:', e);
    }
  }

  return updated;
}

/**
 * Clears reflections for a given user.
 */
export async function clearUserReflections(userId) {
  if (!userId) return;
  localStorage.removeItem(`mirrormind_reflections_${userId}`);

  if (firestoreDbInstance) {
    try {
      const colRef = collection(firestoreDbInstance, `users/${userId}/reflections`);
      const snapshot = await getDocs(colRef);
      snapshot.forEach((d) => {
        deleteDoc(doc(firestoreDbInstance, `users/${userId}/reflections`, d.id)).catch(() => {});
      });
    } catch (e) {
      console.warn('Firestore clear error:', e);
    }
  }
}

export default {
  registerUser,
  loginUser,
  loginWithGoogle,
  resetPassword,
  logoutUser,
  getCurrentUser,
  onAuthStateChanged,
  formatFirebaseUser,
  getUserReflections,
  syncFirestoreReflections,
  saveUserReflection,
  clearUserReflections,
};
