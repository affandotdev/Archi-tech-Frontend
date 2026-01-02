import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYp3CAYhOxdqTCed2VkZwQupgCKAuRkVk",
  authDomain: "chat-notification-4b741.firebaseapp.com",
  projectId: "chat-notification-4b741",
  storageBucket: "chat-notification-4b741.firebasestorage.app",
  messagingSenderId: "282286211166",
  appId: "1:282286211166:web:4ebc68cf949d2f86c7f4cf",
  measurementId: "G-KCCBTV8DRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);