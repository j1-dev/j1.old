// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getPerformance } from "firebase/performance";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCPWk24Z3ZNiyEYjbegNyAZrxdIpF7hYU",
  authDomain: "j1web-7dc6e.firebaseapp.com",
  projectId: "j1web-7dc6e",
  storageBucket: "j1web-7dc6e.appspot.com",
  messagingSenderId: "959529207160",
  appId: "1:959529207160:web:326f740d397c86b850748d",
  measurementId: "G-P0GC8XP0HR",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const perf = getPerformance(app);
