// Import funcțiile necesare din Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configurația Firebase pentru aplicația web
const firebaseConfig = {
  apiKey: "AIzaSyDMrcvZt0hAtUproH1erhMrRw205GnP-L0",
  authDomain: "femeiedecasa-5aa32.firebaseapp.com",
  projectId: "femeiedecasa-5aa32",
  storageBucket: "femeiedecasa-5aa32.firebasestorage.app",
  messagingSenderId: "601755161794",
  appId: "1:601755161794:web:ce0ba6f8d17efb71c5175b",
  measurementId: "G-4V03L6S69D",
};

// Inițializare Firebase
const app = initializeApp(firebaseConfig);

// Inițializare Firestore (baza de date)
const db = getFirestore(app);

// Inițializare Analytics
const analytics = getAnalytics(app);

export { app, db, analytics };
