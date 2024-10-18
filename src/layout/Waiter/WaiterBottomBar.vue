<template>
    <div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-evenly text-xs z-10 h-[4rem]">
        <!-- Home -->
        <div @click="$router.push('/waiter/home')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/waiter/home' }">Home</div>
            <div class="flex justify-center">
                <Icon icon="ion:home" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/waiter/home' }" />
            </div>
        </div>

        <!-- Menu -->
        <div @click="$router.push('/waiter/orders')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/waiter/orders' }">Orders</div>
            <div class="flex justify-center">
                <Icon icon="fluent-mdl2:activate-orders" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/waiter/orders' }" />
            </div>
        </div>

        <!-- Center Plus Button -->
        <div @click="handleScanner"
            class="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer  rounded-full text-emerald-500 justify-center flex items-center w-[60px] h-[60px] z-20 shadow-lg"
            :class="{
                'bg-emerald-500 w-[55px] h-[55px] rounded-xl border-[2px]': $route.path === '/waiter/takeorder',
                'bg-white w-[60px] h-[60px] ': $route.path !== '/waiter/takeorder'
            }">
            <Icon :icon="$route.path === '/waiter/takeorder' ? 'gg:qr' : 'zondicons:add-solid'"
                :height="$route.path === '/waiter/takeorder' ? '45' : '55'"
                :class="{ 'text-white': $route.path === '/waiter/takeorder' }" />
        </div>

        <!-- Rooms -->
        <div class="flex-1 text-center p-2 cursor-pointer">

        </div>

        <!-- Profile -->
        <div @click="$router.push('/waiter/notes')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/waiter/notes' }">Notes</div>
            <div class="flex justify-center">
                <Icon icon="solar:notes-bold-duotone" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/waiter/notes' }" />
            </div>
        </div>
        <div @click="$router.push('/waiter/more')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/waiter/more' }">More</div>
            <div class="flex justify-center">
                <Icon icon="icon-park-outline:more-app" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/waiter/more' }" />
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