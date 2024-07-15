import { initializeApp } from "firebase/app";
import { getAuth, TwitterAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5rX9ClJaXpo_JdneZxlbBAPhj1v3PVmc",
  authDomain: "reactchat-c223c.firebaseapp.com",
  projectId: "reactchat-c223c",
  storageBucket: "reactchat-c223c.appspot.com",
  messagingSenderId: "589940263379",
  appId: "1:589940263379:web:1fe21d113abeb16abb0726"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
export const twitterProvider = new TwitterAuthProvider();
