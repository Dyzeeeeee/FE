<template>
    <div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-evenly text-xs z-10 h-[4rem]">
        <!-- Home -->
        <div @click="$router.push('/accountant/home')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/accountant/home' }">Home</div>
            <div class="flex justify-center">
                <Icon icon="ion:home" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/accountant/home' }" />
            </div>
        </div>
        <div @click="$router.push('/accountant/sales')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/accountant/sales' }">Sales</div>
            <div class="flex justify-center">
                <Icon icon="icon-park-twotone:sales-report" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/accountant/sales' }" />
            </div>
        </div>

        <div @click="$router.push('/accountant/more')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/accountant/more' }">More</div>
            <div class="flex justify-center">
                <Icon icon="icon-park-outline:more-app" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/accountant/more' }" />
            </div>
        </div>
    </div>  


    <Dialog v-model:visible="cameraVisible" modal class="xl:h-[80vh] xl:w-[40vw]" position="center"
        header="Scan Order QR Code">

        <div class="qr-reader">
            <qrcode-stream v-if="cameraActive" :formats="['qr_code']" @detect="onDetect" @camera-on="onCameraOn"
                @error="onError">
                <template #default>
                    <div class="overlay">Scanning...</div>
                </template>
            </qrcode-stream>
        </div>
    </Dialog>
</template>

<script setup>
import { ref } from "vue";
import { QrcodeStream } from 'vue-qrcode-reader';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const cameraActive = ref(false);
const scannedContent = ref('');
// const qrScanner = ref(false);

const handleScanner = () => {
    if (route.path === '/waiter/takeorder') {
        cameraVisible.value = true;
        cameraActive.value = true;

    } else {
        router.push('/waiter/takeorder');
    }
};

const onDetect = (detectedCodes) => {
    console.log('Detected QR Codes:', detectedCodes);

    // Remove 'AIVR' from the detected codes if present
    scannedContent.value = detectedCodes.map(code => {
        let rawValue = code.rawValue;
        if (rawValue.startsWith('AIVR')) {
            // Remove the 'AIVR' prefix
            return rawValue.substring(4); // Removes the first 4 characters
        }
        return rawValue; // Return the raw value if 'AIVR' is not present
    }).join(', ');

    QRcode.value = scannedContent.value;
    confirmOrder();
};


const onCameraOn = (capabilities) => {
    console.log('Camera is on, capabilities:', capabilities);
};

const onError = (error) => {
    console.error('Error with QR Code Stream:', error);
    scannedContent.value = ''; // Clear previous content on error
};

const cameraVisible = ref(false);

const toggleCamera = () => {
    cameraVisible.value = true;
    cameraActive.value = true;
    if (!cameraActive.value) {
        scannedContent.value = '';
    }
};
</script>