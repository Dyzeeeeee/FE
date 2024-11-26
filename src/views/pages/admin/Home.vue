<script setup>
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';
import { onMounted, onUnmounted, ref } from "vue";

const isRounded = ref(true);

const formatRelativeTime = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};
const currentDate = new Date();

function isLessThanOneDayOld(orderDate) {
    const orderDateObj = new Date(orderDate);
    const diffInMilliseconds = currentDate - orderDateObj;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 ms
    return diffInMilliseconds < oneDayInMilliseconds;
}
const orderList = ref([]);
const getAllOrders = async () => {
    try {
        const response = await axios.get('/get-orders'); // Replace with your API endpoint
        if (response.data) {
            // Filter orders based on your conditions
            orderList.value = response.data.filter(order => {
                const hasDetails = Array.isArray(order.details) && order.details.length > 0;
                const isCompletedZero = order.completed == 0;
                return isLessThanOneDayOld(order.created_at) && hasDetails && isCompletedZero;
            });
            console.log('Filtered Orders:', orderList.value);
        } else {
            console.error('No orders found');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};


onMounted(() => {
    window.addEventListener("scroll", handleScroll);
    getUserById();
    getAllOrders(); // Fetch orders initially
    // Set an interval to fetch orders every 1 minute (60,000ms)
    const interval = setInterval(getAllOrders, 60000);
    // Clear the interval when the component is unmounted
    onUnmounted(() => {
        clearInterval(interval);
        window.removeEventListener("scroll", handleScroll);
    });
});

// Fetch details of a specific order when clicked


const currentIndex = ref(0);

// Reference to the scroll container
const scrollContainer = ref(null);

// Function to update the currentIndex when scrolling
const handleScroll = () => {
    const container = scrollContainer.value;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.children[currentIndex.value]?.offsetWidth || 0;

    // Calculate the index based on scroll position
    currentIndex.value = Math.round(scrollLeft / cardWidth);

    // Ensure currentIndex is within bounds
    currentIndex.value = Math.max(0, Math.min(currentIndex.value, orderList.value.length - 1));
};

// Scroll functions for buttons
const scrollRight = () => {
    if (currentIndex.value < orderList.value.length - 1) {
        currentIndex.value++;
        updateScrollPosition();
    }
};

const scrollLeft = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
        updateScrollPosition();
    }
};

// Scroll the container to the current index
const updateScrollPosition = () => {
    const orderWidth = scrollContainer.value.children[currentIndex.value].offsetWidth;
    scrollContainer.value.scrollTo({
        left: orderWidth * currentIndex.value,
        behavior: 'smooth',
    });
};

const userData = ref([]);
const getUserById = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.error('No user ID found in session storage');
        return;
    }

    try {
        const response = await axios.get(`/get-user/${userId}`);
        if (response.data) {
            userData.value = response.data;
            console.log('User data fetched:', userData.value);
        } else {
            console.error('No data returned for user');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};


const dayName = ref(new Date().toLocaleDateString('en-US', { weekday: 'short' })); // "Tue"
const dayNumber = ref(new Date().getDate()); // 6
const monthName = ref(new Date().toLocaleDateString('en-US', { month: 'long' })); // "August"

// Function to update the date components
const updateDateComponents = () => {
    const now = new Date();
    dayName.value = now.toLocaleDateString('en-US', { weekday: 'short' });
    dayNumber.value = now.getDate();
    monthName.value = now.toLocaleDateString('en-US', { month: 'long' });
};

// Interval to update the date components every minute
let dateInterval;
onMounted(() => {
    dateInterval = setInterval(updateDateComponents, 60000); // Update every minute
    getUserById();
});

onUnmounted(() => {
    clearInterval(dateInterval);
});
</script>

<template>
    <div class="grid grid-cols-12 xl:gap-3 gap-2 -m-5 xl:-m-3 mb-10 mt-1">
        <div class="col-span-12 xl:col-span-12 flex items-center">
            <div class="xl:ml-4 mr-2">
                <Avatar
                    image="https://thumbs.dreamstime.com/b/vector-illustration-smiling-shark-cartoon-minimalist-flat-style-isolated-white-background-315602043.jpg"
                    size="xlarge" shape="circle" class="custom-avatar-border" />
            </div>
            <div class="xl:p-2 flex-1">
                <div class="flex justify-between items-center xl:text-4xl text-2xl">
                    <div class="flex-wrap">
                        <div class="flex-wrap">Good Day <span class="font-bold">{{ userData.firstname }}!</span></div>
                        <div class="text-base xl:text-xl flex"><i>{{ userData.role }}</i></div>
                    </div>

                    <div class="flex flex-col items-center xl:mr-6">
                        <div class="text-xl font-medium" style="margin-bottom: -5px">{{ dayName }}</div>
                        <div class="text-3xl font-bold" style="margin-bottom: -5px">{{ dayNumber }}</div>
                        <div class="text-base font-light">{{ monthName }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 hidden">
            <div class="flex justify-end gap-2">
                <div class="w-1/3">
                    <Button class="w-full">
                        <Icon icon="material-symbols-light:menu-book-sharp" height="20" width="20" />
                        Menu
                    </Button>
                </div>
                <div class="w-1/3">
                    <Button class="w-full">
                        <Icon icon="bx:qr" height="20" width="20" />
                        QR
                    </Button>
                </div>
            </div>
        </div>



        <div class="col-span-12 min-h-[25vh] max-h-[40vh] mb-2 px-8 relative">
            <template v-if="orderList.length > 0">
                <button class="absolute -right-2 top-1/2 transform -translate-y-1/2 text-white" @click="scrollRight">
                    <Icon icon="fe:arrow-right" width="40" height="40" class="cursor-pointer pb-2" />
                </button>
                <button class="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white" @click="scrollLeft">
                    <Icon icon="fe:arrow-left" width="40" height="40" class="cursor-pointer pb-2" />
                </button>

                <!-- Index / Length -->
                <div class="flex justify-center">
                    {{ currentIndex + 1 }} / {{ orderList.length }}
                </div>
            </template>

            <div class="flex gap-4 pb-0 mt-1 text-sm xl:text-9xl font-bold p-0 overflow-x-auto whitespace-nowrap"
                ref="scrollContainer" style="scrollbar-width: none; -ms-overflow-style: none;" @scroll="handleScroll">
                <template v-if="orderList.length > 0">
                    <div v-for="(order, index) in orderList" :key="order.id"
                        class="card border-[2px] rounded-xl h-auto min-w-[80vw] m-0 border-white p-0">
                        <div class="w-full">
                            <div
                                class="border-b-[0px] text-surface-900 border-[2px] font-bold text-xl flex justify-between bg-gray-200 rounded-t-lg p-2 border-white">
                                <div class="flex flex-col">
                                    <div>On Standby</div>
                                    <div class=" text-xs">9 minutes ago</div>
                                </div>
                                <div class="flex gap-2">
                                    <button
                                        class="flex justify-center gap-2 px-2 rounded-full border-[1px] border-orange-500 text-orange-500 ">
                                        <div class="self-center">
                                            Prepare
                                        </div>
                                        <div class="self-center">
                                            <Icon icon="cuida:fire-outline" height="20" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <div class="p-4">
                                <div class="font-bold text-xl flex ">
                                    Customer AB
                                </div>
                                <div class="overflow-auto max-h-[10vh] min-h-[10vh]">
                                    <div class="flex justify-between">
                                        <div>
                                            Iced Coffee Latte
                                        </div>
                                        <div>
                                            X1
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div>
                                            Iced Coffee Latte
                                        </div>
                                        <div>
                                            X1
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="flex bg-orange-300 rounded-full mt-4 p-2 border-dashed border-[1px] border-black  overflow-auto  text-black">
                                    <div class="font-bold">Note:&nbsp; </div>
                                    <div class="font-normal truncate">
                                        No ice for the Iced Coffee Latte
                                        No ice for the Iced Coffee Latte
                                        No ice for the Iced Coffee Latte
                                        No ice for the Iced Coffee Latte
                                        No ice for the Iced Coffee Latte
                                        No ice for the Iced Coffee Latte
                                        No ice for the Iced Coffee Latte
                                        No ice for the Iced Coffee Latte
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div
                        class="card border-[2px] border-dashed rounded-xl h-[25vh] min-w-[80vw] m-0 bg-transparent opacity-50 border-white p-0">
                        <div class="w-full h-full flex items-center justify-center gap-2">
                            <div class="text-center text-white font-semibold">No requests at the moment</div>
                            <div>
                                <Icon icon="game-icons:sad-crab" height="20" />
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>



        <div class="col-span-12 h-auto mb-2">
            <div class="flex gap-3 justify-center ">
                <button
                    class="flex flex-col justify-center items-center bg-white text-black border-black border-[2px]  h-[5rem] w-[30%] rounded-xl font-bold hover:bg-yellow-200 hover:text-black hover:border-yellow-500">
                    <div>
                        <Icon icon="fluent-mdl2:activate-orders" height="20" class="" />
                    </div>
                    <div>
                        Orders List
                    </div>
                </button>
                <button
                    class="flex flex-col justify-center items-center bg-white text-black border-black border-[2px]  h-[5rem] w-[30%] rounded-xl font-bold hover:bg-yellow-200 hover:text-black hover:border-yellow-500">
                    <div>
                        <Icon icon="hugeicons:menu-restaurant" height="20" class="" />
                    </div>
                    <div>
                        Take Order
                    </div>
                </button>
                <button
                    class="flex flex-col justify-center items-center bg-white text-black border-black border-[2px]  h-[5rem] w-[30%] rounded-xl font-bold hover:bg-yellow-200 hover:text-black hover:border-yellow-500">
                    <div>
                        <Icon icon="gg:qr" height="30" class="" />
                    </div>
                    <div>
                        Scan QR
                    </div>
                </button>
            </div>
        </div>

        <div class="col-span-12 h-[30vh]">
            <div class="card border-[1px] h-full p-3">
                <div class="flex text-2xl font-bold mb-2">
                    Orders Summary
                </div>
                <div class="flex flex-wrap gap-2 overflow-auto max-h-[20vh]">

                    <!-- <div class="relative">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                            AB
                        </div>
                        <div
                            class="absolute top-0 right-0 h-4 w-4 bg-yellow-500 rounded-full flex justify-center items-center border-[1px]">
                            <Icon icon="fluent:alert-16-filled" width="10" height="10" class="text-white" />
                        </div>
                    </div>
                     -->
                </div>
            </div>
        </div>
    </div>
</template>
