import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBgdfelyzRKiyRzT_FaO7uPPjeiUAoWPdA",
    authDomain: "app-chat-b9e15.firebaseapp.com",
    projectId: "app-chat-b9e15",
    storageBucket: "app-chat-b9e15.appspot.com",
    messagingSenderId: "454792824929",
    appId: "1:454792824929:web:a1e733a130fd6cfb5cc220",
    measurementId: "G-Z5Q5R5Y2NY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore()
