// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDFWAA6-xgxcmeYGTy5Za5aiGddSUF9rzY",
  authDomain: "ecopickup-f1856.firebaseapp.com",
  projectId: "ecopickup-f1856",
  storageBucket: "ecopickup-f1856.firebasestorage.app",
  messagingSenderId: "1025219189395",
  appId: "1:1025219189395:web:35ceb59cdf6f8fe857cb66",
  measurementId: "G-3QHJLS1K5N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
