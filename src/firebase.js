import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvXE1DgxKvRNF5R7vdGrGug1H1xPNVxek",
  authDomain: "ecolocation-947a8.firebaseapp.com",
  projectId: "ecolocation-947a8",
  storageBucket: "ecolocation-947a8.firebasestorage.app",
  messagingSenderId: "150846283227",
  appId: "1:150846283227:web:933f0d9d0c66ccd312dbfe",
  measurementId: "G-LZLM4Z0YQC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
