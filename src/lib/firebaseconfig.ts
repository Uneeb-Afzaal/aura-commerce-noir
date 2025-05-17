// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFgjx-KLF4OsAXmBI_WWqEGZOVwFXiE90",
  authDomain: "sufianah-fc12d.firebaseapp.com",
  projectId: "sufianah-fc12d",
  storageBucket: "sufianah-fc12d.firebasestorage.app",
  messagingSenderId: "398888416687",
  appId: "1:398888416687:web:160fb5470e305670502b5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
