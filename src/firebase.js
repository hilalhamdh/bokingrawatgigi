// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore, collection, query, where, getDocs, addDoc,  doc,  deleteDoc,
  updateDoc, } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDcqgdpqNxVdhkIvHImaN3JEFusd71hNYM",
  authDomain: "perawatan-gigi.firebaseapp.com",
  projectId: "perawatan-gigi",
  storageBucket: "perawatan-gigi.appspot.com", // ✅ diperbaiki
  messagingSenderId: "107527980003",
  appId: "1:107527980003:web:fa7f763a6d64a13d8316d6",
  measurementId: "G-Y0XKLWWMR8"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



const db = getFirestore(app);
const analytics = getAnalytics(app);
export { db, collection, query, where, getDocs, addDoc,  doc, deleteDoc,
  updateDoc };
export { app, auth, signInWithEmailAndPassword, signOut };