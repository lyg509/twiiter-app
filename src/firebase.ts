import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWaq3OppxvUxEAsCueCMXG0A350DFFcxE",
  authDomain: "twitter-app-820ab.firebaseapp.com",
  projectId: "twitter-app-820ab",
  storageBucket: "twitter-app-820ab.appspot.com",
  messagingSenderId: "1029132376411",
  appId: "1:1029132376411:web:631e809f5dae9fe103a27e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
