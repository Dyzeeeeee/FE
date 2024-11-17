<script setup>
import { baseImageUrl } from '@/config';
import { Icon } from "@iconify/vue";
import axios from "axios";
import { formatDistanceToNow, isToday } from 'date-fns';
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from 'vue-router'; // Import Vue Router's useRouter

const router = useRouter(); // Get router instance

const failedImages = ref({});
const selectedOrder = ref({ label: 'All', icon: 'material-symbols-light:note-sharp' });
const formatRelativeTime = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};


const orderOptions = [
    { label: 'All', icon: 'material-symbols-light:note-sharp' },
    { label: 'Menu', icon: 'material-symbols-light:note-sharp' },
    { label: 'Preparing', icon: 'material-symbols:restaurant' },
    { label: 'Pending', icon: 'material-symbols:pending-actions' },
    { label: 'Cancelled', icon: 'material-symbols:cancel' }
];

const selectedCustomerTag = ref("");
const selectedTotalPrice = ref(0);
const selectedService = ref("");
const handleImageError = (itemId) => {
    failedImages.value[itemId] = true;
};
const requestVisible = ref(false);
const userData = ref([]);
const orderList = ref([]);
const activeOrder = ref(null);

const isRounded = ref(true);
const handleScroll = () => {
    isRounded.value = window.scrollY <= 50;
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
    getUserById();
    fetchOrders(); // Fetch orders initially
    // Set an interval to fetch orders every 1 minute (60,000ms)
    const interval = setInterval(fetchOrders, 60000);

    // Clear the interval when the component is unmounted
    onUnmounted(() => {
        clearInterval(interval);
        window.removeEventListener("scroll", handleScroll);
    });
});

// Get user data by ID
const getUserById = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
        console.error("No user ID found in session storage");
        return;
    }

    try {
        const response = await axios.get(`/get-user/${userId}`);
        if (response.data) {
            userData.value = response.data;
            console.log("User data fetched:", userData.value);
        } else {
            console.error("No data returned for user");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};


const fetchOrders = async () => {
    try {
        const response = await axios.get("/get-online-orders");
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


// Fetch details of a specific order when clicked
const selectedOrderDetails = ref([]);
const fetchOrderDetails = async (orderId) => {
    try {
        const response = await axios.get(`/get-online-order-details/${orderId}`);
        if (response.data) {
            const detailsWithImageUrl = response.data.map(detail => {
                return {
                    ...detail,
                    imageUrl: `${baseImageUrl}${encodeURIComponent(detail.image)}`
                };
            });
            return detailsWithImageUrl;
        }
    } catch (error) {
        console.error("Error fetching order details:", error);
        return [];
    }
};

const getOnlineOrderDetails = async (order) => {
    activeOrder.value = order; // Set the active order for the confirmation
    const details = await fetchOrderDetails(order.id);
    selectedOrderDetails.value = details;
    selectedCustomerTag.value = order.customer_tag;
    selectedTotalPrice.value = order.total_price;
    selectedService.value = order.service;
    requestVisible.value = true;
};


const confirmOrder = async () => {
    if (!activeOrder.value) {
        console.error("No active order to confirm");
        return;
    }

    try {
        const response = await axios.put(`/confirmOnlineOrder/${activeOrder.value.id}`, {
            confirmed: 'confirmed',
        });

        if (response.status === 200) {
            console.log('Order confirmed successfully');

            // Extract and store the newly created orderId and customer_tag from the response
            const { orderId, customer_tag } = response.data;

            if (orderId) {
                localStorage.setItem('orderId', orderId);
                console.log('Order ID stored in localStorage:', orderId);
            }
            if (customer_tag) {
                localStorage.setItem('customer_tag', customer_tag);
                console.log('Customer tag stored in localStorage:', customer_tag);
            }

            // Set a flag in localStorage for the other component to read
            localStorage.setItem('orderVisible', true);

            fetchOrders(); // Refresh the orders list
            requestVisible.value = false; // Close the dialog

            // Reroute to `cashier/takeorder`
            router.push('/cashier/takeorder');
        } else {
            console.error('Failed to confirm the order');
        }
    } catch (error) {
        console.error('Error confirming the order:', error);
    }
};






</script>


<template>
    <div class="relative">
        <!-- Main Content -->
        <div class="grid grid-cols-12 xl:gap-3 gap-2 -mx-5 xl:-mx-3 mb-10 mt-16">
            <div class="col-span-12 xl:col-span-12 items-center bg-surface-800 "
                :class="['fixed top-0 left-0 right-0 z-50', isRounded ? 'mt-2 p-2 shadow-md transition-all duration-300 ease-in-out' : 'top-0 bg-gray-800 p-2 transition-all duration-300 ease-in-out shadow-lg ']">
                <div class="flex gap-2 font-bold">
                    <div class="flex justify-end w-[65%]">
                        <InputGroup>
                            <!-- <InputText placeholder="Search your notes" /> -->
                            <!-- <Button>
                                <Icon icon="mingcute:search-line" />
                            </Button> -->
                        </InputGroup>
                    </div>
                    <div class="flex gap-2 w-[35%] justify-end">
                        <Dropdown v-model="selectedOrder" :options="orderOptions" optionLabel="label" class="w-full"
                            placeholder="Select">
                            <template #item="{ option }">
                                <div class="flex items-center gap-2">
                                    <Icon :icon="option.icon" height="30" />
                                    <span>{{ option.label }}</span>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <div class="col-span-12 flex flex-wrap gap-3 relative">
                <template v-if="orderList.length > 0">
                    <div v-for="order in orderList" :key="order.id"
                        class="card-container relative w-full h-[5rem] overflow-hidden border-[1px] rounded-lg">
                        <div class="card h-full p-2 cursor-pointer" @click="getOnlineOrderDetails(order)">
                            <div class="flex justify-between">
                                <div class="flex">
                                    <div class="flex h-full flex-col">
                                        <div
                                            class="bg-yellow-500 rounded-lg h-[4rem] w-[4rem] flex flex-col justify-center items-center text-black">
                                            <span class="text-xs">Customer</span>
                                            <span class="font-bold text-xl">{{ order.customer_tag }}</span>
                                        </div>
                                    </div>
                                    <div class="flex p-1 pl-3 flex-col">
                                        <div>Sent by: {{ order.firstname }} {{ order.lastname }}</div>
                                        <div class="text-sm italic opacity-50">{{ formatRelativeTime(order.updated_at)
                                            }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-else class="w-full text-center py-4 text-gray-500">
                    No orders from any waiter
                </div>
            </div>
        </div>

    </div>

    <Dialog v-model:visible="requestVisible" modal :style="{ width: '90vw', minHeight: '20%', padding: '0px' }"
        position="center">
        <div class="flex flex-col h-full justify-between">
            <!-- Header and Order Details -->
            <div class="mb-4 flex justify-between text-xl">
                <div class="text-lg font-bold">Customer {{ selectedCustomerTag }}</div>
                <div class="text-lg font-bold"> {{ selectedService }}</div>
                <div class="text-lg mb-4 font-bold"> {{ selectedTotalPrice }}</div>
            </div>

            <ul class=" overflow-auto mb-4 max-h-[50vh]">
                <li v-for="detail in selectedOrderDetails" :key="detail.id" class="p-2">
                    <div class="flex gap-2 overflow-auto">
                        <div class="w-12 h-12 w-[20%]">
                            <img :src="detail.imageUrl" alt="Menu detail" class="w-full h-full object-cover rounded"
                                v-if="detail.imageUrl && !failedImages[detail.id]"
                                @error="() => handleImageError(detail.id)" />
                            <img v-else src="@/assets/pics/fallback.jpg" alt="Default Menu Item"
                                class="w-full h-full object-cover rounded" />
                        </div>
                        <div class="self-center flex-1 flex flex-col">
                            <div>{{ detail.name }}</div>
                            <div>{{ detail.quantity }} x {{ detail.price }}</div>
                        </div>
                        <div class="w-[20%] text-xl font-bold flex justify-end">P{{ detail.subtotal }}</div>
                    </div>
                </li>
            </ul>

            <!-- Confirm Button at the Bottom -->
            <div class="mt-auto  h-full flex gap-2">
                <button class="w-full border-red-500 border-[1px] text-red-500 rounded-lg p-3">
                    Reject
                </button>
                <button @click="confirmOrder"
                    class="w-full border-green-500 border-[1px] text-green-500 rounded-lg p-3">
                    Confirm
                </button>
            </div>
        </div>
    </Dialog>

</template>

<style scoped>
.custom-avatar-border {
    border: 2px solid #4caf50;
    padding: 2px;
}
</style>
