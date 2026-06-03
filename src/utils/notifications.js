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
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
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
