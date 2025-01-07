import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZtDKQJd0xoazmq7Y2hj_RQEH_k2_DNBo",
  authDomain: "wi-chat-backend.firebaseapp.com",
  projectId: "wi-chat-backend",
  storageBucket: "wi-chat-backend.firebasestorage.app",
  messagingSenderId: "496885733901",
  appId: "1:496885733901:web:5447df12fd9b2e94241344",
  measurementId: "G-QSQBWGKK2G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); 