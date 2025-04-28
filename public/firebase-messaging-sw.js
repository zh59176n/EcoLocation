// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAvXE1DgxKvRNF5R7vdGrGug1H1xPNVxek",
  authDomain: "ecolocation-947a8.firebaseapp.com",
  projectId: "ecolocation-947a8",
  storageBucket: "ecolocation-947a8.appspot.com",
  messagingSenderId: "150846283227",
  appId: "1:150846283227:web:933f0d9d0c66ccd312dbfe",
  measurementId: "G-LZLM4Z0YQC"
});

// Retrieve messaging instance
const messaging = firebase.messaging();
