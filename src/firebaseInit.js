// src/firebaseInit.js

import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';
const firebaseConfig = {
    apiKey: 'AIzaSyAGhkUdH-9tFFimGJ1p9dzz76YPmrnohX4',
    authDomain: 'pushnotif-3bd70.firebaseapp.com',
    projectId: 'pushnotif-3bd70',
    storageBucket: 'pushnotif-3bd70.appspot.com',
    messagingSenderId: '1043875162981',
    appId: '1:1043875162981:web:6e575e0d6a1015d3d10f8c'
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

// Handle foreground notifications (when the app is open)
onMessage(messaging, (payload) => {
  console.log('Message received in foreground: ', payload);
});

export { messaging };

