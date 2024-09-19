// Import and configure Firebase
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: 'AIzaSyAGhkUdH-9tFFimGJ1p9dzz76YPmrnohX4',
    authDomain: 'pushnotif-3bd70.firebaseapp.com',
    projectId: 'pushnotif-3bd70',
    storageBucket: 'pushnotif-3bd70.appspot.com',
    messagingSenderId: '1043875162981',
    appId: '1:1043875162981:web:6e575e0d6a1015d3d10f8c'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png' // Optional: Add your custom notification icon here
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
