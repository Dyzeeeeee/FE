<script setup>
import AppConfigurator from '@/layout/AppConfigurator.vue';
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const firebaseConfig = {
    apiKey: "AIzaSyAGhkUdH-9tFFimGJ1p9dzz76YPmrnohX4",
    authDomain: "pushnotif-3bd70.firebaseapp.com",
    projectId: "pushnotif-3bd70",
    storageBucket: "pushnotif-3bd70.appspot.com",
    messagingSenderId: "1043875162981",
    appId: "1:1043875162981:web:6e575e0d6a1015d3d10f8c",
    measurementId: "G-5MKB25CEGX"
};

const Install = ref(true)
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
const router = useRouter();
const installPromptEvent = ref(null);
const isInstallable = ref(false);

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Save the event for later use
    installPromptEvent.value = e;
    // Update installable status
    isInstallable.value = true;
});

const handleInstallApp = async () => {
    if (installPromptEvent.value) {
        // Show the install prompt
        installPromptEvent.value.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await installPromptEvent.value.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        // We no longer need the prompt. Clear it up.
        installPromptEvent.value = null;
        isInstallable.value = false;
    }
};
function gotoLogin() {
    router.push('/auth/login');
}

function continueAsGuest() {
    router.push('/customer');
}

function goToSignup() {
    router.push('/auth/signup');
}
</script>

<template>
    <div class="flex w-full justify-between">
        <div>
            <img src="@/assets/pics/AppLogo.png" class="self-center" alt="" style="height: 40px">
        </div>
        <div class="self-center">
            Anahaw Island View Resort is out now!
        </div>
        <div>
            <Button v-if="!isInstallable" @click="handleInstallApp">Install</Button>
        </div>
    </div>
    <AppConfigurator />
    <!-- <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm h-screen"></div> -->

    <!-- <div class="grid grid-cols-12 h-screen"
        style="background-image: url('https://www.bucuti.com/storage/app/uploads/public/5e3/c39/769/thumb_82_1920_1080_0_0_crop.jpg'); background-size: cover; background-position: center">
        <div class="col-span-12 self-center  flex justify-center relative z-10">
            <div class="card w-10/12">

            </div>
        </div>
    </div> -->

    <div class="grid grid-cols-12 h-screen bg-slate-800	">
        <div class="hidden xl:block xl:col-span-7 self-center justify-center">
            <!-- <img src="@/assets/pics/Welcome.png" alt="Welcome" class="h-auto w-full mb-7 object-cover"> -->

        </div>
        <div class="col-span-12 bg-slate-900 p-5 xl:col-span-5 xl:p-10 xl:rounded-3xl xl:m-10">
            <div class="relative flex flex-col justify-center items-center h-1/3 p-0 ">
                <!-- Welcome Image as Background -->
                <img src="@/assets/pics/Welcome.png" alt="Welcome" class="h-auto w-screen mb-7 object-cover xl:hidden">

                <!-- Logo Image at the center with an outline -->
                <img src="@/assets/pics/logo-outline.png" alt="Logo"
                    class="absolute h-[8rem] w-auto my-4 mt-7 xl:h-[6rem]">
            </div>

            <div>
                <div class="text-center font-bold text-5xl xl:text-4xl ">
                    Mabuhay!
                </div>
                <div class="text-center text-base px-4">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam maiores cumque natus impedit
                    laboriosam,
                    sapiente <br>
                    {{ token }}
                </div>
            </div>
            <div class="text-center text-base mt-8 font-bold xl:px-10">
                <Button rounded class="w-full mb-4" @click="gotoLogin">
                    <div class="p-2">Login</div>
                </Button>
                <Button rounded outlined class="w-full" @click="goToSignup">
                    <div class="p-2">Sign Up</div>
                </Button>
            </div>
            <div class="text-center text-sm font-light px-4 mt-7 xl:px-10">
                <Divider align="center">
                    <b>or</b>
                </Divider>
            </div>
            <div class="text-center text-sm font-light px-4 mt-7">
                <Button text>
                    <Icon icon="ri:facebook-fill" width="45" height="45" class="text-blue-500" />
                </Button>
                <Button text>
                    <Icon icon="ri:google-fill" width="45" height="45" class="text-red-500" />
                </Button>
                <Button text>
                    <Icon icon="hugeicons:new-twitter" width="45" height="45" class="text-white" />
                </Button>
            </div>
            <div class="text-center text-base mt-8 font-bold underline " @click="continueAsGuest">
                <div>Continue as guest</div>
            </div>
        </div>


    </div>

    <!-- <Dialog v-model:visible="Install" modal :style="{ width: '80vw', height: '35%' }" position="center"
        header="Install Our App">

        <div class="flex w-full gap-2">
            <img src="@/assets/pics/AppLogo.png" style="height: 50px;" />
            <div class="text-xl self-center">
                Anahaw Island View Resort
            </div>
        </div>
        <div class="flex justify-end gap-2 mt-4 w-full">
            <Button severity="secondary" outlined @click="Install = false" class="w-1/2">Maybe Later</Button>
            <Button severity="success" @click="confirmOrder" class="w-1/2">Install</Button>
        </div>
    </Dialog> -->
</template>

<style scoped></style>
