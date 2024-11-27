<script setup>
import axios from "axios";
import { formatDistanceToNow, isToday } from 'date-fns';
import { onMounted, onUnmounted, ref, computed } from "vue";

const isRounded = ref(true);

const formatRelativeTime = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

const orderList = ref([]);
const fetchOrders = async () => {
    try {
        const response = await axios.get("/get-all-online-orders");
        if (response.data) {
            // Filter orders to include only those that were created today, have a total_price greater than 0, and confirmed is 'sent'
            orderList.value = response.data.filter(order =>
                isToday(new Date(order.updated_at)) &&
                order.total_price > 0 &&
                order.confirmed === 'sent'
            );
        } else {
            console.error("No orders found");
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
};

onMounted(() => {
    getUserById();
    fetchOrders(); // Fetch orders initially
    // Set an interval to fetch orders every 1 minute (60,000ms)
    const interval = setInterval(fetchOrders, 60000);
    // Clear the interval when the component is unmounted
    onUnmounted(() => {
        clearInterval(interval);
    });
});

// Fetch details of a specific order when clicked


const currentIndex = ref(0);
const itemsToShow = ref(window.innerWidth < 640 ? 1 : 3); // 1 for small, 2 for large

// Update `itemsToShow` when the window resizes
const updateItemsToShow = () => {
    itemsToShow.value = window.innerWidth < 640 ? 1 : 3;
};

window.addEventListener('resize', updateItemsToShow);

// Dynamically computes orders to display
const currentOrders = computed(() => {
    if (orderList.value.length === 0) {
        return [];
    }
    return orderList.value.slice(currentIndex.value, currentIndex.value + itemsToShow.value);
});

// Scroll functions
const scrollRight = () => {
    if (currentIndex.value + itemsToShow.value < orderList.value.length) {
        currentIndex.value += itemsToShow.value; // Move forward by the number of items shown
    }
};

const scrollLeft = () => {
    if (currentIndex.value - itemsToShow.value >= 0) {
        currentIndex.value -= itemsToShow.value; // Move backward by the number of items shown
    }
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
    <div class="grid grid-cols-12 xl:gap-3 gap-2 -m-5 xl:-m-3 mb-10 xl:mb-0 xl:m-0 mt-1  xl:mt-16">
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



        <div
            class="col-span-12 xl:col-span-12 min-h-[25vh] xl:min-h-[35vh] max-h-[40vh] xl:max-h-[50vh] mb-2 px-8 relative border-dashed  rounded-lg pb-4 ">
            <template v-if="orderList.length > 0">
                <button v-if="currentIndex > 0" class="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white"
                    @click="scrollLeft">
                    <Icon icon="fe:arrow-left" width="40" height="40" />
                </button>
                <button v-if="currentIndex < orderList.length - 1"
                    class="absolute -right-2 top-1/2 transform -translate-y-1/2 text-white" @click="scrollRight">
                    <Icon icon="fe:arrow-right" width="40" height="40" />
                </button>

                <div class="flex justify-center">
                    {{ currentIndex + 1 }} / {{ orderList.length }}
                </div>
            </template>

            <div class="flex gap-4 pb-0 mt-1 text-sm  xl:text-xl font-bold p-0 xl:px-4 whitespace-nowrap">
                <template v-if="currentOrders.length > 0">
                    <div v-for="(order, index) in currentOrders" :key="order.id"
                        class="card border-[2px] rounded-xl h-auto xl:min-w-[33%] min-w-[80vw] m-0 border-white p-0">
                        <div class="w-full">
                            <div
                                class="border-b-[0px] text-surface-900 border-[2px] font-bold text-xl flex justify-between bg-gray-200 rounded-t-lg p-2 border-white">
                                <div class="flex flex-col">
                                    <div>Customer {{ order.customer_tag }}</div>
                                    <div class="text-xs">{{ formatRelativeTime(order.updated_at) }}</div>
                                </div>
                                <div class="flex gap-2">
                                    <button
                                        class="flex justify-center gap-2 h-[2rem] w-[2rem] rounded-full border-[1px] border-gray-500 text-gray-500 hover:border-red-500 hover:text-red-500 hover:bg-red-300">
                                        <div class="self-center">
                                            <Icon icon="maki:cross" height="20" />
                                        </div>
                                    </button>
                                    <button
                                        class="flex justify-center gap-2 h-[2rem] w-[2rem] rounded-full border-[1px] border-gray-500 text-gray-500 hover:border-green-500 hover:text-green-500 hover:bg-green-200">
                                        <div class="self-center">
                                            <Icon icon="entypo:check" height="20" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <div class="px-2 py-2">
                                <div class="p-2 bg-gray-900 mb-2 font-bold text-xl flex justify-between">
                                    <div>{{ order.service }}</div>
                                    <div>P {{ order.total_price }}</div>
                                </div>
                                <div class="overflow-auto max-h-[15vh] min-h-[10vh] xl:min-h-[15vh]">
                                    <div class="flex justify-between">
                                        <div class="flex flex-col">
                                            <div class="text-lg">Iced Coffee Latte</div>
                                            <div class="italic">
                                                <span>2x</span><span>200.00</span>
                                            </div>
                                        </div>
                                        <div class="text-lg self-center">P400.00</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-show="currentOrders.length === 1"
                        class="xl:block hidden card border-[2px] border-dashed rounded-xl h-[25vh] xl:min-w-[33%] min-w-[80vw] h-auto m-0 bg-transparent opacity-50 border-white p-0">
                        <div class="w-full h-full flex items-center justify-center gap-2">
                            <div class="text-center text-white font-semibold  xl:text-xl">
                            </div>
                            <div>
                                <Icon icon="game-icons:sad-crab" height="20" />
                            </div>
                        </div>
                    </div>
                    <div v-show="currentOrders.length === 1 || currentOrders.length === 2"
                        class="xl:block hidden card border-[2px] border-dashed rounded-xl h-[25vh] xl:min-w-[33%] min-w-[80vw] h-auto m-0 bg-transparent opacity-50 border-white p-0">
                        <div class="w-full h-full flex items-center justify-center gap-2">
                            <div class="text-center text-white font-semibold  xl:text-xl">
                            </div>
                            <div>
                                <Icon icon="game-icons:sad-crab" height="20" />
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div
                        class="card border-[2px] border-dashed rounded-xl h-[25vh] xl:min-w-[100%] min-w-[80vw] xl:h-[35vh] m-0 bg-transparent opacity-50 border-white p-0">
                        <div class="w-full h-full flex items-center justify-center gap-2">
                            <div class="text-center text-white font-semibold  xl:text-xl">No requests at the moment
                            </div>
                            <div>
                                <Icon icon="game-icons:sad-crab" height="20" />
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>



        <div class="col-span-12 xl:col-span-4 h-auto mb-2 ">
            <div class="flex gap-3 justify-center xl:flex-col items-center self-center h-full">
                <button
                    class="flex flex-col justify-center items-center bg-white  text-black border-black border-[2px]  h-[5rem] w-[30%] xl:w-[90%] rounded-xl font-bold hover:bg-yellow-200 hover:text-black hover:border-yellow-500">
                    <div>
                        <Icon icon="fluent-mdl2:activate-orders" height="20" class="" />
                    </div>
                    <div>
                        Orders List
                    </div>
                </button>
                <button
                    class="flex flex-col justify-center items-center bg-white text-black border-black border-[2px]  h-[5rem] w-[30%] xl:w-[90%] rounded-xl font-bold hover:bg-yellow-200 hover:text-black hover:border-yellow-500">
                    <div>
                        <Icon icon="hugeicons:menu-restaurant" height="20" class="" />
                    </div>
                    <div>
                        Take Order
                    </div>
                </button>
                <button
                    class="flex flex-col justify-center items-center bg-white text-black border-black border-[2px]  h-[5rem] w-[30%] xl:w-[90%] rounded-xl font-bold hover:bg-yellow-200 hover:text-black hover:border-yellow-500">
                    <div>
                        <Icon icon="gg:qr" height="30" class="" />
                    </div>
                    <div>
                        Scan QR
                    </div>
                </button>
            </div>
        </div>

        <div class="col-span-12 xl:col-span-8 h-[30vh]">
            <div class="card border-[1px] h-full p-3">
                <div class="flex text-2xl font-bold mb-2">
                    Active Customers
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
    