import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export async function requestFcmPermission() {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BB3eMNdbaVHO1i5x3ZQb3qkx_NYHeICb_tJcYwA52NlICU3OHuYYe5PaiWgpiYc-ldTbyYQ2q81Ck2NXNw7yEZk",
      });
      console.log("FCM TOKEN:", token);
      return token;
    } else {
      console.log("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
