(() => {
  console.log('Hello from service worker')
})();

/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyAKvNmxdqKKAnsdH6VQNJvY4T3aF2W7wn4",
  authDomain: "zebpay-ticker.firebaseapp.com",
  projectId: "zebpay-ticker",
  storageBucket: "zebpay-ticker.appspot.com",
  messagingSenderId: "24894946053",
  appId: "1:24894946053:web:4aefd7295e2a960701556c",
  measurementId: "G-K4565TPXJS"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
