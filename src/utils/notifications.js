// src/utils/notifications.js
import { getMessaging, getToken } from "firebase/messaging";
import app from "../firebase"; 

export const requestNotificationPermission = async () => {
  try {
    if (Notification.permission === "granted") {
      console.log("Notification permission already granted.");
      return;
    }

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: "BAoM53EmY1QAyo14kYX9NO5-IxSCc3scxANRb6wRuRxeTrwgGfd3P0Qt6YZhinhwg85g93X8QOWL1fDEtzmP-WY", // from Firebase Console -> Project Settings -> Cloud Messaging
    });

    if (token) {
      console.log("Notification permission granted. Token:", token);
      // Optional: Save the token to Firestore under user's profile
    } else {
      console.log("No token received. User may have denied permission.");
    }
  } catch (error) {
    console.error("Error requesting notification permission", error);
  }
};
