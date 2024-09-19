// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: 'AIzaSyAGhkUdH-9tFFimGJ1p9dzz76YPmrnohX4',
    authDomain: 'pushnotif-3bd70.firebaseapp.com',
    projectId: 'pushnotif-3bd70',
    storageBucket: 'pushnotif-3bd70.appspot.com',
    messagingSenderId: '1043875162981',
    appId: '1:1043875162981:web:6e575e0d6a1015d3d10f8c',
    measurementId: 'G-5MKB25CEGX'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notifcation.title;
    const notificationOptions = {
        body: payload.notifcation.body,
        icon: '/shark.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
