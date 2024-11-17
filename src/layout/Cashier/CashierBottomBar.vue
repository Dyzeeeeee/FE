<script setup>
import axios from 'axios';
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { QrcodeStream } from 'vue-qrcode-reader';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const cameraActive = ref(false);
const scannedContent = ref('');
const cameraVisible = ref(false);

const hasRequests = ref(false); // Initially false until data is loaded
const requestCount = ref(0); // Default request count

// Function to fetch online orders and count those with status 'sent'
const fetchOnlineOrders = async () => {
    try {
        const response = await axios.get('/get-online-orders'); // Replace with your API endpoint
        const orders = response.data; // Adjust based on your API response structure

        // Filter and count orders with the status 'sent'
        const sentOrders = orders.filter(order => order.confirmed === 'sent');
        requestCount.value = sentOrders.length;
        hasRequests.value = sentOrders.length > 0;
    } catch (error) {
        console.error('Error fetching online orders:', error);
    }
};

// Automatically fetch online orders when the component is mounted and refresh every 30 seconds
let intervalId;
onMounted(() => {
    fetchOnlineOrders(); // Initial fetch
    intervalId = setInterval(fetchOnlineOrders, 30000); // Refresh every 30 seconds
});

onBeforeUnmount(() => {
    clearInterval(intervalId); // Clear the interval when the component is unmounted
});

const handleScanner = () => {
    if (route.path === '/cashier/takeorder') {
        cameraVisible.value = true;
        cameraActive.value = true;
    } else {
        router.push('/cashier/takeorder');
    }
};

const onDetect = (detectedCodes) => {
    console.log('Detected QR Codes:', detectedCodes);
    // Process the detected QR code and handle further actions
};

const onCameraOn = (capabilities) => {
    console.log('Camera is on, capabilities:', capabilities);
};

const onError = (error) => {
    console.error('Error with QR Code Stream:', error);
    scannedContent.value = ''; // Clear previous content on error
};

// Watcher for requestCount changes
watch(requestCount, (newCount, oldCount) => {
    console.log(`Request count changed from ${oldCount} to ${newCount}`);
    if (newCount > oldCount) {
        console.log('New sent orders have been added!');
        // You can add more actions here, such as notifications or UI updates
    }
});
</script>




<template>
    <div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-evenly text-xs z-10 h-[4rem]">
        <!-- Home -->
        <div @click="$router.push('/cashier/home')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/cashier/home' }">Home</div>
            <div class="flex justify-center">
                <Icon icon="ion:home" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/cashier/home' }" />
            </div>
        </div>

        <!-- Menu -->
        <div @click="$router.push('/cashier/orders')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/cashier/orders' }">Track</div>
            <div class="flex justify-center">
                <Icon icon="fluent-mdl2:activate-orders" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/cashier/orders' }" />
            </div>
        </div>

        <!-- Center Plus Button -->
        <div @click="handleScanner"
            class="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer  rounded-full text-emerald-500 justify-center flex items-center w-[60px] h-[60px] z-20 shadow-lg"
            :class="{
                'bg-emerald-500 w-[55px] h-[55px] rounded-xl border-[2px]': $route.path === '/cashier/takeorder',
                'bg-white w-[60px] h-[60px] ': $route.path !== '/cashier/takeorder'
            }">
            <Icon :icon="$route.path === '/cashier/takeorder' ? 'gg:qr' : 'zondicons:add-solid'"
                :height="$route.path === '/cashier/takeorder' ? '45' : '55'"
                :class="{ 'text-white': $route.path === '/cashier/takeorder' }" />
        </div>

        <!-- Rooms -->
        <div class="flex-1 text-center p-2 cursor-pointer">

        </div>

        <!-- Profile -->
        <div @click="$router.push('/cashier/requests')" class="flex-1 text-center p-2 cursor-pointer relative">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/cashier/requests' }">Requests</div>
            <div class="flex justify-center">
                <Icon icon="mdi:receipt-pending" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/cashier/requests' }" />
            </div>
            <!-- Badge -->
            <span v-if="hasRequests"
                class="absolute bottom-2 right-6 text-white border-[1px] border-white bg-red-500 opacity-80 text-xs rounded-full p-1 h-[1rem] w-[1rem] font-bold text-[0.5rem] text-center flex flex-col items-center justify-center">
                {{ requestCount }}
            </span>
        </div>

        <div @click="$router.push('/cashier/more')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/cashier/more' }">More</div>
            <div class="flex justify-center">
                <Icon icon="icon-park-outline:more-app" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/cashier/more' }" />
            </div>
        </div>
    </div>

    <!-- QR Code Scanner Dialog -->
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
        <div class="flex justify-end">
            <button class="border-white border-[1px] rounded-lg p-2">
                Type code instead
            </button>
        </div>
    </Dialog>
</template>
