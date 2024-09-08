// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCe4xp0aVyYlVzp-WuXRhyZb_BvcVEvA9M",
  authDomain: "hall-booking-2eed6.firebaseapp.com",
  projectId: "hall-booking-2eed6",
  storageBucket: "hall-booking-2eed6.appspot.com",
  messagingSenderId: "137883076750",
  appId: "1:137883076750:web:24ed8379081ab5503d21df",
  measurementId: "G-3XRQ8B1XVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };