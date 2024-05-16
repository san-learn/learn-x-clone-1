import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "learn-x-clone-1-ed179.firebaseapp.com",
  projectId: "learn-x-clone-1-ed179",
  storageBucket: "learn-x-clone-1-ed179.appspot.com",
  messagingSenderId: "420729116563",
  appId: "1:420729116563:web:9deca004a174e15926fa66",
};

export const app = initializeApp(firebaseConfig);
