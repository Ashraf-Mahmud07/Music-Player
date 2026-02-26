import { getApps, initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile as firebaseUpdateProfile,
    getAuth,
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
} from "firebase/auth";
import {
    getDownloadURL,
    getStorage,
    ref as storageRef,
    uploadBytes,
} from "firebase/storage";
import firebaseConfig from "../config/firebaseConfig";

// Initialize Firebase only once
if (!getApps().length) {
  initializeApp(firebaseConfig as any);
}

const auth = getAuth();
const storage = getStorage();

export async function signUpWithEmail({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  if (name) {
    await firebaseUpdateProfile(userCredential.user, { displayName: name });
  }
  return userCredential.user;
}

export async function signInWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function uploadProfilePhoto(file: { uri: string; name?: string }) {
  // file.uri is expected to be a local file URI (expo ImagePicker result or similar)
  // In React Native we need to fetch the blob first
  const response = await fetch(file.uri);
  const blob = await response.blob();
  const path = `profiles/${Date.now()}_${file.name || "photo"}`;
  const r = storageRef(storage, path);
  await uploadBytes(r, blob);
  const url = await getDownloadURL(r);
  // update profile photo URL
  if (auth.currentUser) {
    await firebaseUpdateProfile(auth.currentUser, { photoURL: url });
  }
  return url;
}

// Google sign-in helper using expo-auth-session: you will need to install and configure expo-auth-session and provide webClientId
export async function signInWithGoogle(idToken: string) {
  // idToken comes from Google sign-in flow (expo-auth-session)
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

export { auth };

