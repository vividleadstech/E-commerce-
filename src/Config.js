import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDomUqea4ldY0IOVYucMnBy77JnxUFzBEM",
  authDomain: "vividtechhub-545d3.firebaseapp.com",
  projectId: "vividtechhub-545d3",
  storageBucket: "vividtechhub-545d3.firebasestorage.app",
  messagingSenderId: "39573263973",
  appId: "1:39573263973:web:16c0c4d2ff88ea1c4d988c",
  measurementId: "G-MSE429ZMJY",
};

const app            = initializeApp(firebaseConfig);
const auth           = getAuth(app);
const db             = getFirestore(app);
const storage        = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// ── Write user doc to Firestore if it doesn't exist yet ──────────────────
const writeUserDoc = async (user) => {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:         user.uid,
      displayName: user.displayName || "",
      email:       user.email || "",
      photoURL:    user.photoURL || null,
      role:        "user",
      joinedAt:    serverTimestamp(),
    });
  }
};

// ── Google sign-in — writes user doc on first login ──────────────────────
const handleGoogleLogin = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await writeUserDoc(result.user);
  return result.user;
};

// ── Email sign-up — creates account, sets display name, writes user doc ──
const handleEmailSignup = async (firstName, lastName, email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, {
    displayName: `${firstName} ${lastName}`,
  });
  // Re-read user so displayName is set before writing doc
  await writeUserDoc({ ...result.user, displayName: `${firstName} ${lastName}` });
  return result.user;
};

// ── Email sign-in ─────────────────────────────────────────────────────────
const handleEmailLogin = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export {
  auth,
  db,
  storage,
  googleProvider,
  handleGoogleLogin,
  handleEmailSignup,
  handleEmailLogin,
};