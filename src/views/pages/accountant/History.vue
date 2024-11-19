<template>
    <div class="grid grid-cols-12 xl:gap-3 gap-2 -mx-5 xl:-mx-3 mt-12 ">
        <div class="col-span-12 xl:col-span-12 items-center bg-surface-800]"
            :class="['fixed top-0 left-0 right-0 z-50', isRounded ? 'mt-2 p-2 shadow-md transition-all duration-300 ease-in-out' : ' top-0 bg-gray-800  p-2 transition-all duration-300 ease-in-out shadow-lg ']">
            <div class="flex gap-2 font-bold">

                <!-- <div class="flex-1">

                </div> -->
                <div class="flex justify-end w-[65%]">
                    <InputGroup>
                        <InputText placeholder="Search history" />
                        <Button>
                            <Icon icon="mingcute:search-line" />
                        </Button>
                    </InputGroup>
                </div>
                <div class="flex gap-2 w-[35%] justify-end">
                    <Dropdown v-model="selectedOrder" :options="orderOptions" optionLabel="label" class="w-full"
                        placeholder="Select">
                        <template #item="{ option }">
                            <div class="flex items-center gap-2">
                                <!-- Use the correct Iconify component with dynamic icon -->
                                <Icon :icon="option.icon" height="30" />
                                <span>{{ option.label }}</span>
                            </div>
                        </template>
                    </Dropdown>
                </div>
            </div>
        </div>
        <div class="col-span-12 flex gap-3 relative ">

            <div class="">
                <div class="flex justify-between">
                    <div class="font-bold text-2xl p-3 ml-3">
                        History
                    </div>
                    <div class="h-full self-center mr-2">
                        <button @click="rotateIcon" class="self-center" ref="refreshButton">
                            <Icon icon="bx:refresh" height="30" :class="rotationClass" />
                        </button>
                    </div>
                </div>
                <ul class="space-y-0 rounded-lg bg-gray-800">
                    <li v-for="(log, index) in logs" :key="index" :class="{
                        'bg-gray-800': index % 2 === 0,  // Apply bg-gray-800 for even
                        'bg-gray-700': index % 2 !== 0   // Apply bg-gray-700 for odd
                    }" class="">
                        <div
                            class="rounded-lg flex items-start space-x-4 px-4 py-2 shadow-lg transition-transform transform hovers:scale-105 hovers:bg-gray-600">
                            <!-- User Avatar -->
                            <div class="relative self-center">
                                <Avatar
                                    image="https://img.freepik.com/premium-vector/cute-chicken-illustration_533500-14.jpg"
                                    shape="circle" size="large"
                                    class="border-[1px] p-1 border-gray-300 shadow-lg self-center " />
                            </div>

                            <!-- Action Content -->
                            <div class="flex-1">
                                <p class="text-white text-base font-medium">
                                    <span class="font-semibold">{{ log.kitchen_firstname }} {{ log.kitchen_lastname }}
                                        &nbsp;</span>
                                    <span :class="{ [getStatusIcon(log.status).textColor]: true }">{{
                                        getStatusIcon(log.status).action
                                    }}&nbsp;</span>
                                    <span class="font-bold px-1 bg-gray-600 text-white">{{ log.menu_name }}</span>
                                </p>
                                <p class="text-gray-500 text-sm">{{ formatRelativeTime(log.updated_at) }}</p>
                            </div>

                            <!-- Icon with Circular Background -->
                            <div class="relative flex self-center">
                                <!-- First Circle -->
                                <img :src="log.imageUrl" alt="Item Image"
                                    class="self-center rounded-full h-[3rem] w-[3rem] object-cover border-[1px] border-orange-200">

                                <!-- Second Circle with dynamic border color based on parent li's bg color -->
                                <div :class="{
                                    'border-gray-800': index % 2 === 0,  // Border color for even background
                                    'border-gray-700': index % 2 !== 0,
                                    [getStatusIcon(log.status).colorClass]: true  // Dynamically set colorClass from status
                                    // Border color for odd background
                                }"
                                    class="opacity-90 border-[3px] absolute top-1/2 right-1/2 transform -translate-y-1/2 self-center rounded-full p-1 ">
                                    <Icon :icon="getStatusIcon(log.status).icon" height="20"
                                        :class="getStatusIcon(log.status).colorClass" />
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>



            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { onMounted, onUnmounted, ref } from "vue";

import fallbackImage from '@/assets/pics/fallback.jpg';
import { baseImageUrl } from '@/config'; // Make sure the path is 
const imageUrl = ref(""); // Declare the image URL

const formatRelativeTime = (dateString) => {
    const orderDate = new Date(dateString);
    const now = new Date();

    // Log the order date and current date for debugging
    console.log("Order Date:", orderDate);
    console.log("Current Date:", now);

    // Ensure the dates are in the same timezone (you might want to adjust this if you're working with UTC)
    if (orderDate.getTime() > now.getTime()) {
        // Log if the order date is in the future
        console.log("Order date is in the future");
        return formatDistanceToNow(orderDate, { addSuffix: true });
    }

    // Log the result from formatDistanceToNow
    const relativeTime = formatDistanceToNow(orderDate, { addSuffix: true });
    console.log("Relative Time:", relativeTime);

    return relativeTime;
};
const handleImageError = () => {
    // Set the fallback image if the image fails to load
    imageUrl.value = fallbackImage;
};
// Sample log data with avatars, actions, and icons

const isRounded = ref(true); // State to manage if the topbar is rounded


const rotateIcon = () => {
    getOrderDetails();
    rotationClass.value = 'rotate'; // Apply rotation class
    setTimeout(() => {
        rotationClass.value = ''; // Remove the rotation class after animation ends
    }, 1000); // Set this time to match the animation duration
};

const handleScroll = () => {
    // Change the shape based on the scroll position
    if (window.scrollY > 50) {
        isRounded.value = false;
    } else {
        isRounded.value = true;
    }
};

const logs = ref([]);

// Function to fetch logs (order details)
const getOrderDetails = async () => {
    try {
        const response = await axios.get('/get-order-details');
        if (response.data) {
            console.log('Order Details:', response.data);

            // Filter logs to only include items with status "preparing", "serving", or "served"
            logs.value = response.data
                .filter(item => ['preparing', 'serving', 'served'].includes(item.status))  // Filter by status
                .map(item => {
                    // Set the image URL for each log item, falling back to default if not available
                    item.imageUrl = item.menu_image ? `${baseImageUrl}${encodeURIComponent(item.menu_image)}` : fallbackImage;
                    return item;
                })
                // Sort logs by updated_at (latest to oldest)
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        } else {
            console.error('No order details found');
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
};



const getStatusIcon = (status) => {
    switch (status) {
        case 'preparing':
            return {
                icon: 'cuida:fire-outline',
                textColor: 'text-orange-500 ',
                colorClass: 'text-orange-500 bg-orange-200',
                action: 'started preparing'
            };
        case 'serving':
            return {
                icon: 'game-icons:hot-meal',
                textColor: 'text-yellow-500',
                colorClass: 'text-yellow-500 bg-yellow-100',
                action: 'finished preparing'
            };
        case 'served':
            return {
                icon: 'line-md:check-all',
                textColor: 'text-green-500',
                colorClass: 'text-green-500 bg-green-100',
                action: 'finished preparing'
            };
        default:
            return {
                icon: '',
                colorClass: '',
                action: 'Status is unknown.'
            };
    }
};


// Call the function when needed (e.g., on mounted)
const rotationClass = ref(''); // This will hold the rotation class


onMounted(() => {
    getOrderDetails();
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

const selectedOrder = ref({ label: 'All', icon: 'material-symbols-light:note-sharp' })

const orderOptions = [
    { label: 'All', icon: 'material-symbols-light:note-sharp' },
    { label: 'Menu', icon: 'material-symbols-light:note-sharp' },
    { label: 'Preparing', icon: 'material-symbols:restaurant' },
    { label: 'Pending', icon: 'material-symbols:pending-actions' },
    { label: 'Cancelled', icon: 'material-symbols:cancel' }
]


</script>

<style scoped>
/* Add some hover effect for better interaction */

.rotate {
    animation: rotateAnimation 1s ease-in-out;
}

@keyframes rotateAnimation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(-360deg);
    }
}

/* Example additional styles if needed */
</style>