importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCYp3CAYhOxdqTCed2VkZwQupgCKAuRkVk",
  authDomain: "chat-notification-4b741.firebaseapp.com",
  projectId: "chat-notification-4b741",
  messagingSenderId: "282286211166",
  appId: "1:282286211166:web:4ebc68cf949d2f86c7f4cf"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
