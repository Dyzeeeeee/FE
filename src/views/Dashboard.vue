<template>
  <button @click="sendNotification">Send Notification</button>

</template>

<script setup>
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { ref } from 'vue';

const firebaseConfig = {
  apiKey: "AIzaSyAGhkUdH-9tFFimGJ1p9dzz76YPmrnohX4",
  authDomain: "pushnotif-3bd70.firebaseapp.com",
  projectId: "pushnotif-3bd70",
  storageBucket: "pushnotif-3bd70.appspot.com",
  messagingSenderId: "1043875162981",
  appId: "1:1043875162981:web:6e575e0d6a1015d3d10f8c",
  measurementId: "G-5MKB25CEGX"
};

const token = ref('');

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging();
onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  alert(`Message received: ${payload.notification.title}`);
});



getToken(messaging, { vapidKey: 'BJdT2QzOC15wwG2VJSxhN1eLFU2JwoFPDNg7UsyWVcNzbOoL0E4IBELeTjPCR__E6itzzlG6v1Xj4jJPMTz2HJM' }).then((currentToken) => {
  if (currentToken) {
    console.log("Token is: ", currentToken);
    token.value = currentToken; // Store token in a reactive variable
    // Send the token to your server
    axios.post('/save-token', { token: currentToken })
      .then(response => console.log('Token saved:', response))
      .catch(error => console.error('Error saving token:', error));
  } else {
    console.log('No registration token available. Request permission to generate one.');
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
});


function sendNotification() {
  // Hard-coded message details for testing
  const notificationData = {
    token: token.value,
    title: "Test Notification",
    body: "This is a test notification from Vue.js"
  };

  axios.post('/send-notification', notificationData)
    .then(response => {
      console.log('Notification sent:', response);
      alert('Notification sent successfully!');
    })
    .catch(error => {
      console.error('Error sending notification:', error);
      alert('Failed to send notification.');
    });
}

</script>
