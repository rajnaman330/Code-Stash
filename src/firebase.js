// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBY9aMRSL9H0djiCy1KW0mwV0ZJeZX9QX4",
  authDomain: "code-stash-47faa.firebaseapp.com",
  databaseURL: "https://code-stash-47faa-default-rtdb.firebaseio.com",
  projectId: "code-stash-47faa",
  storageBucket: "code-stash-47faa.firebasestorage.app",
  messagingSenderId: "785592899327",
  appId: "1:785592899327:web:0eb43fbbb559ef4c24deca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Realtime Database
export const db = getDatabase(app);