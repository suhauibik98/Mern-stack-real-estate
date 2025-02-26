// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRE_BASE_API_KEY,
  authDomain: "estate-mern-a2657.firebaseapp.com",
  projectId: "estate-mern-a2657",
  storageBucket: "estate-mern-a2657.appspot.com",
  messagingSenderId: "219385386381",
  appId: "1:219385386381:web:debaa1f1293c482a9859c4",
  measurementId: "G-SVZJR01CX6"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);
 export{app , analytics}