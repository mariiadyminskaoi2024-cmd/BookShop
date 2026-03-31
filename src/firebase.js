import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// твій конфіг (залишаєш як є)
const firebaseConfig = {
  apiKey: "AIzaSyDIfsNg29HzzQ504vUETaD9q1PaklxRM1E",
  authDomain: "book-d2171.firebaseapp.com",
  projectId: "book-d2171",
  storageBucket: "book-d2171.firebasestorage.app",
  messagingSenderId: "369767404065",
  appId: "1:369767404065:web:0deb0fda0e66cf94270960",
  measurementId: "G-JJ6BJBDZ4Z"
};

// ініціалізація
const app = initializeApp(firebaseConfig);

// 🔥 ОСЬ ГОЛОВНЕ (додати!)
export const auth = getAuth(app);
export const db = getFirestore(app);