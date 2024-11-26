<script setup>
import fallbackImage from '@/assets/pics/fallback.jpg';
import { baseImageUrl } from '@/config'; // Make sure the path is correct based on your project structure
import axios from "axios";

import { formatDistanceToNow } from "date-fns";
import { computed, onMounted, onUnmounted, ref } from "vue";
const selectedItem = ref(null);  // Stores selected item details
const selectedOrder = ref(null); // Store the entire order context
const imageUrl = ref(""); // Declare the image URL
const selectedCategory = ref('All'); // Default to "All"

const itemStatus = ref(false);
const showCustomers = ref(true);
const openItemDialog = (order, item) => {
    selectedItem.value = item;
    console.log("seleted", selectedItem)
    itemStatus.value = true;
    selectedOrder.value = order; // Store the whole order

    // Set the image URL dynamically or fallback if the menu_image is not available
    imageUrl.value = item.menu_image ? `${baseImageUrl}${encodeURIComponent(item.menu_image)}` : fallbackImage;
};

const getLeftIcon = computed(() => {
    const category = uniqueCategories.value.find(cat => cat.name === selectedCategory.value);
    return category ? category.icon : 'iconamoon:arrow-left-2-duotone'; // Fallback icon if not found
});



const startPreparing = async (itemId) => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.error('No user ID found in session storage');
        return;
    }

    selectedItem.value = { id: itemId }; // Optional: set the selected item with the ID for tracking
    itemStatus.value = false;

    // Make an API request to update the order detail status and pass the userId
    try {
        const response = await axios.put(`/update-order-detail/${itemId}`, {
            status: 'preparing',
            kitchen_id: userId // Pass the userId as kitchen_id
        });

        if (response.status === 200) {
            console.log('Order detail updated successfully:', response.data);

            // If you have access to the item object locally, update its status:
            if (selectedItem.value) {
                selectedItem.value.status = 'preparing'; // Update status locally
            }
            getAllOrders(); // Refresh orders after update
        } else {
            console.error('Failed to update order detail:', response.data);
        }
    } catch (error) {
        console.error('Error updating order detail:', error);
        if (error.response) {
            console.error('Server response:', error.response.data);
        }
    }
};


const readyToServe = async (itemId) => {
    selectedItem.value = { id: itemId }; // Optional: set the selected item with the ID for tracking
    itemStatus.value = false;

    // Make an API request to update the order detail status using axios
    try {
        const response = await axios.put(`/update-order-detail/${itemId}`, {
            status: 'serving'
        });

        if (response.status === 200) {
            console.log('Order detail updated successfully:', response.data);

            // If you have access to the item object locally, update its status:
            if (selectedItem.value) {
                selectedItem.value.status = 'serving'; // Update status locally
            }
            getAllOrders();
        } else {
            console.error('Failed to update order detail:', response.data);
        }
    } catch (error) {
        console.error('Error updating order detail:', error);
        if (error.response) {
            console.error('Server response:', error.response.data);
        }
    }
};



const uniqueCategories = computed(() => {
    const categoryMap = new Map();

    // Always start with the "All" category
    categoryMap.set('All', {
        name: 'All',
        icon: 'mdi:format-list-bulleted' // Replace with a suitable icon for "All"
    });

    orders.value.forEach(order => {
        order.details.forEach(detail => {
            if (!categoryMap.has(detail.category_name)) {
                categoryMap.set(detail.category_name, {
                    name: detail.category_name,
                    icon: detail.category_icon
                });
            }
        });
    });

    return Array.from(categoryMap.values());
});

// Method to handle category selection
const selectCategory = (category) => {
    selectedCategory.value = category.name;
};

// Filtered orders based on the selected category
const filteredOrders = computed(() => {
    if (selectedCategory.value === 'All') {
        return orders.value;
    }
    return orders.value.filter(order =>
        order.details.some(detail => detail.category_name === selectedCategory.value)
    );
});




const getStatusIcon = (status) => {
    switch (status) {
        case 'standby':
            return {
                icon: 'ic:baseline-mode-standby',
                colorClass: 'text-gray-400',
                description: 'This order is in standby.'
            };
        case 'preparing':
            return {
                icon: 'cuida:fire-outline',
                colorClass: 'text-orange-500',
                description: 'This order is currently being prepared.'
            };
        case 'serving':
            return {
                icon: 'game-icons:hot-meal',
                colorClass: 'text-yellow-500',
                description: 'This order is ready to be served.'
            };
        case 'served':
            return {
                icon: 'line-md:check-all',
                colorClass: 'text-green-500',
                description: 'This order has been served.'
            };
        default:
            return {
                icon: '',
                colorClass: '',
                description: 'Status is unknown.'
            };
    }
};

const isRounded = ref(true); // State to manage if the topbar is rounded

const handleScroll = () => {
    // Change the shape based on the scroll position
    if (window.scrollY > 50) {
        isRounded.value = false;
    } else {
        isRounded.value = true;
    }
}; onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
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
const handleImageError = () => {
    // Set the fallback image if the image fails to load
    imageUrl.value = fallbackImage;
};

const dayName = ref(new Date().toLocaleDateString('en-US', { weekday: 'long' })); // "Tue"
const dayNumber = ref(new Date().getDate()); // 6
const monthName = ref(new Date().toLocaleDateString('en-US', { month: 'long' })); // "August"

// Function to update the date components
const updateDateComponents = () => {
    const now = new Date();
    dayName.value = now.toLocaleDateString('en-US', { weekday: 'short' });
    dayNumber.value = now.getDate();
    monthName.value = now.toLocaleDateString('en-US', { month: 'long' });
};

const statusColor = (status) => {
    switch (status.toLowerCase()) {
        case "pending":
            return "bg-orange-300 text-orange-300 border-orange-300 border-[1px]";
        case "paid":
            return "bg-green-300 text-green-300 border-green-300 border-[1px]";
        case "cancelled":
            return "bg-red-400 text-red-400 border-red-400 border-[1px]";
        default:
            return "bg-gray-400 text-gray-300 border-gray-400 border-[1px]";
    }
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
const orders = ref([]);

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
const currentDate = new Date();
function isLessThanOneDayOld(orderDate) {
    const orderDateObj = new Date(orderDate);
    const diffInMilliseconds = currentDate - orderDateObj;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 ms
    return diffInMilliseconds < oneDayInMilliseconds;
}

const getAllOrders = async () => {
    try {
        const response = await axios.get('/get-orders'); // Replace with your API endpoint
        if (response.data) {
            // Filter orders based on your conditions
            orders.value = response.data.filter(order => {
                const hasDetails = Array.isArray(order.details) && order.details.length > 0;
                const isCompletedZero = order.completed == 0;
                return isLessThanOneDayOld(order.created_at) && hasDetails && isCompletedZero;
            });
            console.log('Filtered Orders:', orders.value);
        } else {
            console.error('No orders found');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

onMounted(() => {
    getAllOrders();
});

</script>

<template>
    <div class="grid grid-cols-12 xl:gap-3 gap-2 -mx-5 xl:-mx-3 mb-10">
        <div class="col-span-12 xl:col-span-12 items-center bg-gray-900  "
            :class="['fixed top-0 left-0 right-0 z-[1]', isRounded ? ' p-2 shadow-md transition-all duration-300 ease-in-out' : ' top-0 bg-gray-800  p-2 transition-all duration-300 ease-in-out shadow-lg ']">
            <div class="flex gap-2 overflow-x-auto transition-all duration-300 ease-in-out transform"
                :class="showCustomers ? 'flex gap-2 overflow-x-auto' : 'hidden'"
                style="overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none;">
                <div v-for="(category, index) in uniqueCategories" :key="index" @click="selectCategory(category)"
                    class="relative">
                    <div :class="{ 'bg-white text-surface-900': selectedCategory === category.name }"
                        class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                        <Icon :icon="category.icon" height="20" class="self-center" />
                    </div>

                    <!-- Container for the category name with truncation -->
                    <div class="text-center text-xs overflow-hidden whitespace-nowrap text-ellipsis w-[3rem]">
    {{ category.name }}
</div>

                </div>

            </div>
            <div class="flex justify-between bg-surface-700 mt-2 p-2 font-bold rounded-full">
                <!-- <div class="self-center flex-1">
                    <Button class="h-[2rem]" rounded severity="danger">Close</Button>
                </div> -->
                <div class="self-center w-1/4 justify-start flex gap-2 ">
                    <Icon icon="iconamoon:arrow-left-2-duotone" height="30" class="self-center" />
                </div>
                <div class="self-center flex-1 justify-center flex gap-2 ">
                    <Icon :icon="getLeftIcon" height="20" class="self-center" />
                    <div class="self-center">
                        {{ selectedCategory }}
                    </div>
                </div>
                <div class="self-center w-1/4 justify-end flex gap-2 ">
                    <Icon icon="iconamoon:arrow-right-2-duotone" height="30" class="self-center" />
                </div>
                <!-- <div class="flex-1 self-center justify-end flex">
                    3
                </div> -->
            </div>
            <div @click="showCustomers = !showCustomers"
                class="absolute left-1/2 bottom-[-20px] w-16 h-16 bg-gray-900 rounded-full z-[-1] transform -translate-x-1/2 shadow-lg flex flex-col justify-end items-center">
                <div class="flex items-center justify-center">
                    <Icon :icon="showCustomers ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" height="30" />
                </div>
            </div>

        </div>

        <div class="col-span-12 flex flex-col gap-3 " :class="showCustomers ? 'mt-32' : 'mt-20'">
            <div v-for="order in filteredOrders" :key="order.id" class="col-span-12 flex flex-col gap-3 card p-0 m-0">
                <div class="flex w-full">
                    <div :class="['rounded-tl-lg rounded-bl-lg min-w-[4%]', statusColor(order.status)]"></div>
                    <div class="w-[96%] p-3">
                        <div class="flex-wrap text-2xl font-bold mb-2">
                            <div class="flex justify-between">
                                <div>Order #{{ order.id }}</div>
                                <div :class="['rounded-full border-[1px] px-2 self-center text-base w-auto flex', statusColor(order.status),]"
                                    style="background-color: #203444;">
                                    <Icon icon="material-symbols:payments-outline-rounded" height="20" class="mr-1" />
                                    {{ order.status }}
                                </div>
                            </div>
                            <div class="italic flex text-xs font-normal">{{ formatRelativeTime(order.updated_at) }}
                            </div>
                        </div>

                        <div class="border-[1px] border-dashed w-full p-2">
                            <div v-for="item in order.details" :key="item.id" class="flex justify-between"
                                @click="openItemDialog(order, item)">
                                <div class="flex gap-1">
                                    <div class="flex gap-1">
                                        <div>{{ item.quantity }}x</div>
                                        <div class="underline">{{ item.menu_name }}</div>
                                        <div v-if="item.note" class="flex self-center text-blue-300">
                                            <Icon icon="fluent:note-24-filled" height="20" class="" />
                                        </div>
                                    </div>
                                </div>
                                <div :class="getStatusIcon(item.status).colorClass" v-tooltip.left="item.status">
                                    <Icon :icon="getStatusIcon(item.status).icon" height="20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <Dialog v-model:visible="itemStatus" modal :style="{ width: '80vw', minHeight: '25%', padding: '0px' }"
        position="center" :header="selectedItem ? selectedItem.menu_name : 'Name of the menu item'">
        <div v-if="selectedItem" class="bg-blue-100 border-[1px] border-dashed p-2 text-sm text-black overflow-auto">
            <span class="font-bold">Note:&nbsp;</span>{{ selectedItem.note || 'No note available' }}
        </div>

        <!-- Display the image of the selected menu item -->
        <div v-if="selectedItem && selectedItem.menu_image" class="mt-4">
            <img :src="imageUrl" alt="Menu Item" @error="handleImageError"
                class="self-center w-[20rem] h-[8rem] rounded-lg border-[1px] border-yellow-500 p-[1px] object-cover">
        </div>


        <div v-if="selectedItem" class="mt-2">
            {{ getStatusIcon(selectedItem.status).description }} by {{ selectedOrder.customer_name }}

            <div :class="getStatusIcon(selectedItem.status).colorClass" class="flex">
                {{ selectedItem.status }}
                <Icon :icon="getStatusIcon(selectedItem.status).icon" height="20" />
            </div>
        </div>

        <div class="flex justify-end gap-2 p-0 w-full mt-2">
            <button v-if="selectedItem.status === 'standby'" @click="startPreparing(selectedItem.detail_id)"
                class="flex w-full bg-transparent rounded-lg text-orange-500 p-2 justify-center font-bold border-[1px] border-orange-500">
                <div>Start Preparing</div>
                <Icon icon="cuida:fire-outline" height="20" />
            </button>

            <button v-else-if="selectedItem.status === 'preparing'" @click="readyToServe(selectedItem.detail_id)"
                class="flex w-full bg-transparent rounded-lg text-yellow-500 p-2 justify-center font-bold border-[1px] border-yellow-500 gap-1">
                <div>Ready to Serve</div>
                <Icon icon="game-icons:hot-meal" height="20" class="" />
            </button>
            <button v-else-if="selectedItem.status === 'serving'" @click="itemStatus = false"
                class="flex w-full bg-transparent rounded-lg text-white  p-2 justify-center font-bold border-[1px] border-white ">
                <div>Okay</div>
            </button>
        </div>
    </Dialog>
</template>

<style scoped>
.custom-avatar-border {
    border: 2px solid #4caf50;
    padding: 2px;
}

.deep .button-class {
    background-color: white !important;
    /* Use important only as a last resort */
}
</style>
