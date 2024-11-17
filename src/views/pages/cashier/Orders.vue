<script setup>
import fallbackImage from '@/assets/pics/fallback.jpg';
import { baseImageUrl } from '@/config'; // Make sure the path is correct based on your project structure
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useToast } from 'primevue/usetoast';

import { computed, onMounted, onUnmounted, ref } from "vue";
const toast = useToast();

const itemStatus = ref(false);
const showCustomers = ref(true);
const selectedItem = ref(null);  // Stores selected item details
const openItemDialog = (order, item) => {
    selectedItem.value = item;
    itemStatus.value = true;
    selectedOrder.value = order; // Store the whole order

    // Set the image URL dynamically or fallback if the menu_image is not available
    imageUrl.value = item.menu_image ? `${baseImageUrl}${encodeURIComponent(item.menu_image)}` : fallbackImage;
};
const imageUrl = ref(""); // Declare the image URL
const selectedOrder = ref(null); // Store the entire order context

const handleImageError = () => {
    // Set the fallback image if the image fails to load
    imageUrl.value = fallbackImage;
};

const closeCustomer = () => {
    // Ensure the selected customer is not 'All'
    if (selectedCustomer.value === 'All') {
        console.warn("Cannot close 'All' as a customer.");
        return;
    }

    // Find orders that match the selected customer tag
    const customerOrders = orders.value.filter(order => order.customer_tag === selectedCustomer.value);

    // Check if there are any pending orders (status not completed)
    const hasPendingOrders = customerOrders.some(order => order.status === 'pending');

    if (hasPendingOrders) {
        // Show a message or notification if there are pending orders
        console.warn("Cannot close customer with pending orders.");
        toast.add({ severity: 'warn', summary: 'Action Denied', detail: 'There are pending orders for this customer.', life: 3000 });
        return;
    }

    // Mark all orders for the selected customer as completed (set completed status to '1')
    customerOrders.forEach(order => {
        order.completed = '1'; // Ensure the order's completed field is set properly
    });

    // Optionally trigger a batch update to save changes to the server
    batchUpdateOrders(customerOrders);

    // Clear the selected customer
    selectedCustomer.value = 'All';
    console.log(`Customer '${selectedCustomer.value}' closed successfully.`);
};


const batchUpdateOrders = (orders) => {
    axios.post('/batch-update-orders', { orders })
        .then(response => {
            console.log("Orders updated successfully:", response);
        })
        .catch(error => {
            console.error("Error updating orders:", error);
        });
};

const isRounded = ref(true); // State to manage if the topbar is rounded
const handleScroll = () => {
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

const currentDate = new Date();
function isLessThanOneDayOld(orderDate) {
    const orderDateObj = new Date(orderDate);
    const diffInMilliseconds = currentDate - orderDateObj;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 ms
    return diffInMilliseconds < oneDayInMilliseconds;
}

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

// Example testing


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
// Function to update the date components
const updateDateComponents = () => {
    const now = new Date();
    dayName.value = now.toLocaleDateString('en-US', { weekday: 'short' });
    dayNumber.value = now.getDate();
    monthName.value = now.toLocaleDateString('en-US', { month: 'long' });
};
let dateInterval;
onMounted(() => {
    dateInterval = setInterval(updateDateComponents, 60000); // Update every minute
    getUserById();
});
onUnmounted(() => {
    clearInterval(dateInterval);
});
const orders = ref([]);

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


const uniqueCustomerTags = computed(() => {
    // Create a map to store total prices for each customer tag
    const tagTotalPriceMap = new Map();

    // Create a set to track customer tags where not all orders are completed
    const incompleteTagsSet = new Set();

    // Loop through orders to calculate total price for each tag and track completion
    orders.value.forEach(order => {
        if (Array.isArray(order.details)) {
            const orderTotal = order.details.reduce((total, detail) => {
                const subtotal = parseFloat(detail.subtotal) || 0;
                return total + subtotal;
            }, 0);

            // Add the total price to the map for the specific customer tag
            if (order.customer_tag) {
                const existingTotal = tagTotalPriceMap.get(order.customer_tag) || 0;
                tagTotalPriceMap.set(order.customer_tag, existingTotal + orderTotal);

                // Check if any order for this customer tag has `completed !== 1`
                if (order.completed != 1) {
                    incompleteTagsSet.add(order.customer_tag);
                }
            }
        }
    });

    // Log the total price map for debugging
    console.log("Tag Total Price Map:", Array.from(tagTotalPriceMap.entries()));

    // Ensure 'All' is always present in the map
    tagTotalPriceMap.set('All', tagTotalPriceMap.get('All') || 0);

    // Filter out tags where all orders are completed (completed === 1)
    let filteredTags = Array.from(tagTotalPriceMap.keys()).filter(tag => {
        const totalPriceForTag = tagTotalPriceMap.get(tag) || 0;
        console.log(`Tag: ${tag}, Total Price: ${totalPriceForTag}`);
        // Include 'All' and only include other tags with incomplete orders
        return (tag === 'All' || totalPriceForTag > 0) && (tag === 'All' || incompleteTagsSet.has(tag));
    });

    // Ensure 'All' is at the first position
    filteredTags = filteredTags.sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : 0));

    // Log the filtered and sorted tags
    console.log("Filtered and Sorted Tags:", filteredTags);

    return filteredTags;
});







const selectedCustomer = ref('All'); // Default to 'All' or another appropriate default

// Filtered orders based on selected customer
const filteredOrders = computed(() => {
    return orders.value.filter(order => {
        const isRecent = isLessThanOneDayOld(order.updated_at); // Check if order is within 1 day
        const isCustomerSelected = selectedCustomer.value === 'All' || order.customer_tag === selectedCustomer.value;
        const hasDetails = Array.isArray(order.details) && order.details.length > 0; // Ensure details exists and has items
        const isCompletedZero = order.completed == 0; // Only include orders where status is 0 (not completed)

        // Return orders that match all the conditions
        return isRecent && isCustomerSelected && hasDetails && isCompletedZero;
    });
});


function selectCustomer(tag) {
    selectedCustomer.value = tag;
}

// Fetch all orders and details
const getAllOrders = async () => {
    try {
        const response = await axios.get('/get-orders'); // Update with your API endpoint
        if (response.data) {
            orders.value = response.data;
            console.log('Orders fetched:', orders.value);
        } else {
            console.error('No orders found');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

// Fetch orders on component mount
onMounted(() => {
    getAllOrders();
});

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

const totalPrice = computed(() => {
    return filteredOrders.value.reduce((total, order) => {
        // Ensure that order.details is an array and exists
        if (Array.isArray(order.details)) {
            return total + order.details.reduce((orderTotal, detail) => {
                // Ensure that detail.subtotal is a number
                const subtotal = parseFloat(detail.subtotal) || 0;
                return orderTotal + subtotal;
            }, 0);
        }
        return total;
    }, 0);
});

</script>
<template>
    <div class="grid grid-cols-12 xl:gap-3 gap-2 -mx-5 xl:-mx-3 mb-10">
        <div class="col-span-12 xl:col-span-12 items-center bg-gray-900  "
            :class="['fixed top-0 left-0 right-0 z-[1]', isRounded ? ' p-2 shadow-md transition-all duration-300 ease-in-out' : ' top-0 bg-gray-800  p-2 transition-all duration-300 ease-in-out shadow-lg ']">
            <div class="flex gap-2 overflow-x-auto transition-all duration-300 ease-in-out transform"
                :class="showCustomers ? 'flex gap-2 overflow-x-auto' : 'hidden'"
                style="overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none;">

                <!-- Loop through unique customer tags -->
                <div v-for="(tag, index) in uniqueCustomerTags" :key="index" class="relative"
                    @click="selectCustomer(tag)">
                    <div :class="{ 'bg-white text-surface-900': selectedCustomer === tag }"
                        class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                        {{ tag }}
                    </div>
                </div>
            </div>

            <div class="flex justify-between bg-surface-700 mt-2 p-2 font-bold rounded-full">
                <div class="self-center flex gap-2 justify-end">
                    <div class="self-center w-1/4 justify-start flex gap-2 ">
                        <Icon icon="iconamoon:arrow-left-2-duotone" height="30" class="self-center" />
                    </div>
                    <div class="self-center">
                        Total: {{ totalPrice }} <!-- Display the total price dynamically -->
                    </div>
                </div>
                <div class="self-center">
                    {{ selectedCustomer === 'All' ? 'All Customers' : 'Customer ' + selectedCustomer }}
                </div>
                <div class="flex gap-2 justify-end">
                    <Button class="h-[2rem]" rounded severity="danger" :disabled="selectedCustomer === 'All'"
                        @click="closeCustomer">
                        Close
                    </Button>

                    <div class="self-center w-1/4 justify-start flex gap-2 ">
                        <Icon icon="iconamoon:arrow-right-2-duotone" height="30" class="self-center" />
                    </div>
                </div>
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
            Order Taken/Made by {{ selectedOrder.customer_name }}

            <div class="flex"> Status: &nbsp;
                <div :class="getStatusIcon(selectedItem.status).colorClass" class="flex">
                    {{ selectedItem.status }}
                    <Icon :icon="getStatusIcon(selectedItem.status).icon" height="20" />
                </div>
            </div>

        </div>

        <div class="flex justify-end gap-2 p-0 w-full mt-2">
            <button
                class="flex w-full bg-transparent rounded-lg text-white  p-2 justify-center font-bold border-[1px] border-white ">
                <div>Okay</div>
            </button>
        </div>
    </Dialog>



</template>

<style scoped></style>
