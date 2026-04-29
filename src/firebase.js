import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // <-- Added for database features

const firebaseConfig = {
  apiKey: "AIzaSyB_tg3j7tA6sum_7VO3uOALH4DvD6eyAoM",
  authDomain: "dtechnurse-f9cca.firebaseapp.com",
  projectId: "dtechnurse-f9cca",
  storageBucket: "dtechnurse-f9cca.firebasestorage.app",
  messagingSenderId: "16014381854",
  appId: "1:16014381854:web:3943b88f35bcc58abdef0f",
  measurementId: "G-9ZWE8ZH3K6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (Works perfectly in Vite/React)
const analytics = getAnalytics(app);

// Initialize Firestore and export it so your hooks can use it
export const db = getFirestore(app); 
