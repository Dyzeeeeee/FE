<script setup>
import { baseImageUrl } from '@/config'; // Make sure the path is correct based on your project structure
import axios from "axios";
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const itemStatus = ref(false);
const categories = ref([]);
const selectedCategoryId = ref('All');  // Initially set to 'All'
const allMenuItems = ref([]);  // Holds all menu items unfiltered
const menuItems = ref([]);
const isRounded = ref(true);
const searchTerm = ref(''); // Reactive variable for search term
const selectedItemId = ref(null); // Track the currently selected item
const showCategories = ref(true);
const orderId = ref(null);
const detailsVisible = ref(false);


const selectedService = ref('Dine in'); // Default selection

function selectService(service) {
    selectedService.value = service;
}

const failedImages = ref({}); // Object to track failed image status for each item
const toggleItem = (itemId) => {
    // Toggle the currently selected item
    selectedItemId.value = selectedItemId.value === itemId ? null : itemId;
};

const totalUniqueItems = computed(() => orderDetails.value.length);

const toast = useToast();

function showDetails(item) {
    selectedItem.value = item;
    detailsVisible.value = true;
}
const selectedItem = ref(null);


const getOnlineOrder = async () => {
    try {
        orderId.value = localStorage.getItem('orderId'); // Get the order ID from local storage

        if (orderId.value) {
            const response = await axios.get(`/get-online-order/${orderId.value}`); // API call to get online order

            if (response && response.data) {
                // Store the fetched order details
                const order = response.data;
                isConfirmed.value = order.confirmed; // Assuming the order has a 'confirmed' field
                console.log('Order fetched:', order);
            } else {
                console.error('No data received for the order');
            }
        }
    } catch (error) {
        console.error('Error fetching the online order:', error);
    }
};
const isConfirmed = ref(0); // This will track if the order is confirmed or not (0 = not confirmed, 1 = confirmed)

const incrementQuantity = async (itemId) => {
    try {
        const item = orderDetails.value.find(detail => detail.menu_item_id === itemId);
        if (item) {
            item.quantity = parseInt(item.quantity, 10) + 1;  // Increment quantity with parseInt
            item.subtotal = parseFloat(item.price) * item.quantity;  // Update subtotal as a float

            // Update the order detail in the backend
            await axios.post('/add-or-update-online-order-detail', {
                online_order_id: orderId.value,
                menu_item_id: itemId,
                quantity: item.quantity,
                subtotal: item.subtotal
            });

            console.log(`Increased quantity for item ID ${itemId} to ${item.quantity}`);
        }
    } catch (error) {
        console.error('Error incrementing quantity:', error);
    }
};

const decrementQuantity = async (itemId) => {
    const item = orderDetails.value.find(detail => detail.menu_item_id === itemId);
    if (item) {
        if (parseInt(item.quantity, 10) === 1) {
            // If quantity is 1, call removeItem instead
            await removeItem(item);
        } else {
            // Decrement the quantity and update backend
            item.quantity = parseInt(item.quantity, 10) - 1;
            item.subtotal = parseFloat(item.price) * item.quantity;

            // Update the order detail in the backend
            await axios.post('/add-or-update-online-order-detail', {
                online_order_id: orderId.value,
                menu_item_id: itemId,
                quantity: item.quantity,
                subtotal: item.subtotal
            });
        }
    }
};

const removeItem = async (detail) => {
    try {
        const response = await axios.delete(`/remove-order-detail/${detail.id}`);
        if (response.status === 200) {
            // Remove the item from orderDetails in the frontend
            orderDetails.value = orderDetails.value.filter(d => d.menu_item_id !== detail.menu_item_id);
            console.log(`Item with ID ${detail.menu_item_id} removed successfully.`);
        }
    } catch (error) {
        console.error('Error removing item:', error);
    }
};

const totalOrderAmount = computed(() => {
    return orderDetails.value.reduce((acc, item) => acc + item.price * item.quantity, 0);
});




const handleImageError = (itemId) => {
    failedImages.value[itemId] = true; // Mark the specific item as failed
};
const filteredMenuItems = computed(() => {
    const lowerCasedSearchTerm = searchTerm.value.toLowerCase();
    return allMenuItems.value.filter(item => {
        const matchesCategory = selectedCategoryId.value === 'All' || item.category_id === selectedCategoryId.value;
        const matchesSearch = item.name.toLowerCase().includes(lowerCasedSearchTerm);
        return matchesCategory && matchesSearch;
    }).reduce((uniqueItems, item) => {
        if (!uniqueItems.some(i => i.id === item.id)) {
            uniqueItems.push(item);
        }
        return uniqueItems;
    }, []);
});


const orderItemCount = computed(() => orderDetails.value.length);


const filterCategory = (categoryId) => {
    selectedCategoryId.value = categoryId;  // Update the selected category ID
    menuItems.value = categoryId === 'All'
        ? allMenuItems.value
        : allMenuItems.value.filter(item => item.category_id === categoryId);
};



const getMenu = async () => {
    try {
        const response = await axios.get('/get-menu');
        allMenuItems.value = response.data.map(item => ({
            ...item,
            imageUrl: `${baseImageUrl}${encodeURIComponent(item.image)}`
        }));
        menuItems.value = allMenuItems.value;  // Initially show all items
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
};

const handleScroll = () => {
    if (window.scrollY > 50) {
        isRounded.value = false;
    } else {
        isRounded.value = true;
    }
}; onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});
const getItemQuantity = (itemId) => {
    const detail = orderDetails.value.find(d => d.menu_item_id === itemId);
    return detail ? detail.quantity : 0;  // Return the quantity if found, otherwise 0
};

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

const customerList = ref([
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'
]);



const customerVisible = ref(false);

const selectedCustomer = ref(null);

const newCustomer = ref(''); // The customer input value

const addCustomer = () => {
    if (newCustomer.value && !customerList.value.includes(newCustomer.value)) {
        customerList.value.push(newCustomer.value);
        newCustomer.value = ''; // Clear input after adding
    }
};

const selectCustomer = (customer) => {
    selectedCustomer.value = customer; // Set the selected customer
    customerVisible.value = false; // Close dialog after selection
};
const getCategories = async () => {
    try {
        const response = await axios.get('/get-categories'); // API call
        if (response && response.data) {
            categories.value = response.data;  // Store the fetched categories data
            console.log('Categories fetched:', response.data);
        } else {
            console.error('No data received from the server');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);  // Error handling
    }
};

// Interval to update the date components every minute
onMounted(async () => {
    getUserById();
    getCategories();
    getMenu();
    getOnlineOrderDetails();
    getOnlineOrder();
});
const isItemAdded = (itemId) => {
    return orderDetails.value.some(detail => detail.menu_item_id === itemId);
};

const generateRandomQR = () => {
    const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    text.value = `AIVR${randomNumber}`;
    localStorage.setItem('qrCode', text.value);
}


const text = ref(localStorage.getItem('qrCode') || 'AIVR12345');

const orderVisible = ref(false);

const showOrderDetails = () => {
    orderVisible.value = true;
    detailsVisible.value = false;
};

watch(orderVisible, (newValue) => {
    if (newValue) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
});
watch(detailsVisible, (newValue) => {
    if (newValue) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
});

const createOrder = async (userId) => {
    try {
        generateRandomQR();
        console.log("text", text.value);
        const response = await axios.post('/create-online-order', { customer_id: userId, qrcode: text.value });
        if (response.data && response.data.id) {
            orderId.value = response.data.id;  // Set the newly created order ID in the reactive reference
            localStorage.setItem('orderId', orderId.value);  // Store the order ID in localStorage
            console.log('Order ID:', orderId.value); // Logging the order ID

            return orderId.value;
        }
    } catch (error) {
        console.error('Error creating order:', error);
    }
};

const orderDetails = ref([]);

const loading = ref(false);

const addToOrder = async (menuItem) => {
    loading.value = true; // Start loading indicator
    const userId = sessionStorage.getItem('userId');
    orderId.value = localStorage.getItem('orderId');

    if (!orderId.value) {
        orderId.value = await createOrder(userId);
    }

    if (orderId.value) {
        try {
            const orderDetailsResponse = await axios.get(`/get-online-order-details/${orderId.value}`);
            orderDetails.value = orderDetailsResponse.data;

            const existingItem = orderDetails.value.find(detail => detail.menu_item_id === menuItem.id);

            let orderDetail = {
                online_order_id: orderId.value,
                menu_item_id: menuItem.id,
                quantity: 1,
                subtotal: menuItem.price
            };

            if (existingItem) {
                orderDetail.quantity = parseInt(existingItem.quantity, 10) + 1;
                orderDetail.subtotal = parseFloat(menuItem.price) * orderDetail.quantity;
            }

            const response = await axios.post('/add-or-update-online-order-detail', orderDetail);
            console.log('Item added/updated in order:', response.data);

            // Manually update orderDetails value to reflect the new quantity
            if (existingItem) {
                existingItem.quantity = orderDetail.quantity;
                existingItem.subtotal = orderDetail.subtotal;
            } else {
                orderDetails.value.push(orderDetail); // Add the new item if it didn't exist
            }

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Item ${menuItem.name} added to the order successfully!`,
                life: 2000
            });

            getOnlineOrderDetails(); // Refresh the order details if needed
        } catch (error) {
            console.error('Error adding/updating item in order:', error);
        } finally {
            loading.value = false; // Ensure loading is stopped after completion
        }
    } else {
        console.error('No order ID found, cannot add/update item in order.');
        loading.value = false; // Stop loading if no order ID
    }
};


const getOnlineOrderDetails = async () => {
    try {
        orderId.value = localStorage.getItem('orderId');

        const response = await axios.get(`/get-online-order-details/${orderId.value}`);
        if (response && response.data) {
            orderDetails.value = response.data.map(item => ({
                ...item,
                imageUrl: `${baseImageUrl}${encodeURIComponent(item.image)}`
            }));
            console.log('Details fetched:', orderDetails.value);
        } else {
            console.error('No data received from the server');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};


const confirmedStatus = ref('sent');

const confirmOrder = async () => {
    if (!selectedCustomer.value) {
        // Show toast notification if no customer tag is selected
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'No customer tag selected', life: 3000 });
        return;
    }

    try {
        const response = await axios.put(`/update-online-order/${orderId.value}`, {
            total_price: totalOrderAmount.value,
            customer_tag: selectedCustomer.value,
            service: selectedService.value,
            confirmed: confirmedStatus.value
        });

        const userId = sessionStorage.getItem('userId');
        orderId.value = localStorage.getItem('orderId');
        if (response.status === 200) {
            if (orderId.value) {
                orderId.value = await createOrder(userId);
            }

            orderDetails.value = [];
            selectedCustomer.value = null;
            orderVisible.value = false;
            console.log('Order confirmed successfully', response.data);
        } else {
            console.error('Failed to confirm order');
        }
    } catch (error) {
        console.error('Error confirming order:', error);
    }
};



</script>

<template>
    <Toast />
    <div class="grid grid-cols-12 xl:gap-3 gap-1 -mx-5 xl:-mx-3" :class="{
        'mt-24': showCategories,
        'mt-12': !showCategories,
        'mb-20': orderItemCount > 0,
        'mb-10': orderItemCount === 0
    }">
        <div class="col-span-12 xl:col-span-12 items-center bg-surface-800"
            :class="['fixed top-0 left-0 right-0 z-50', isRounded ? 'mt-2 p-2 shadow-md transition-all duration-300 ease-in-out' : ' top-0 bg-gray-800  p-2 transition-all duration-300 ease-in-out shadow-lg ']">
            <div class="flex gap-2 font-bold">
                <div class="flex gap-2 w-[35%]">
                    <div
                        class="rounded-full text-lgs font-bold h-[2rem] w-[33%] self-center flex justify-center items-center flex-col bg-whste text-white-500 border-white-500">
                        <Icon icon="ic:sharp-menu-book" height="25" />
                    </div>
                    <div
                        class="rounded-full text-lgs font-bold h-[2rem] w-[33%] self-center flex justify-center items-center flex-col bg-whste text-white-500 border-white-500">
                        <Icon icon="material-symbols:pending-actions" height="25" />

                    </div>
                    <div v-if="!selectedCustomer" @click="customerVisible = true"
                        class="rounded-full text-lgs font-bold h-[2rem] w-[33%] self-center flex justify-center items-center flex-col bg-whste text-white-500 border-white-500">
                        <Icon icon="mdi:user-add" height="25" />
                    </div>
                    <div v-else
                        class="rounded-xl border-[1px] text-lg font-bold h-[2.5rem] w-[33%] self-center flex justify-center items-center text-black font-bold bg-white border-whites"
                        @click="customerVisible = true">
                        {{ selectedCustomer }}
                    </div>

                </div>
                <!-- <div class="flex-1">

                </div> -->
                <div class="flex justify-end w-[65%] self-center">
                    <InputText v-model="searchTerm" placeholder="Search the menu" class="w-full h-[2.5rem]" />
                </div>
            </div>
            <div class="relative flex items-center w-full mt-2 "
                :class="showCategories ? 'flex gap-2 overflow-x-auto' : 'hidden'">
                <Icon icon="fe:arrow-left" width="50" height="50" @click="scrollToLeft"
                    class="cursor-pointer pb-2  hidden xl:block" />
                <div ref="scrollContainer"
                    class="flex gap-2 pb-0 text-sm xl:text-9xl font-bold relative overflow-x-auto whitespace-nowrap"
                    style="scrollbar-width: none; -ms-overflow-style: none;">

                    <button @click="filterCategory('All')"
                        :class="['min-w-[5rem] xl:min-w-[7rem] rounded-xl px-4 py-2 text-sm font-semibold', selectedCategoryId === 'All' ? 'bg-white text-black font-bold' : 'bg-transparent border  border-white text-white']">
                        All
                    </button>

                    <button v-for="category in categories" :key="category.id" @click="filterCategory(category.id)"
                        :class="['w-auto rounded-xl px-4 py-2 text-sm font-semibold flex items-center whitespace-nowrap',
                            selectedCategoryId === category.id ? 'bg-white text-black font-bold' : 'bg-transparent border border-white text-white']">
                        <div class="flex items-center">
                            <Icon :icon="category.icon" height="20" />
                            <span class="ml-2">
                                {{ category.name }}
                            </span>
                        </div>
                    </button>


                </div>
                <!-- Floating Button positioned to the right -->
                <Icon icon="fe:arrow-right" width="50" height="50" @click="scrollToRight"
                    class="cursor-pointer pb-2 hidden xl:block" />

            </div>
            <div @click="showCategories = !showCategories"
                class="absolute left-1/2 bottom-[-20px] w-16 h-16 bg-surface-800 rounded-full z-[-1] transform -translate-x-1/2 shadow-lg flex flex-col justify-end items-center">
                <div class="flex items-center justify-center">
                    <Icon :icon="showCategories ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" height="30" />
                </div>
            </div>
        </div>
        <div class="col-span-12 flex gap-3 mb-3">

        </div>

        <div class="col-span-12" v-for="item in filteredMenuItems" :key="item.id">
            <div class="relative flex gap-2 font-bold justify-between card p-2 m-0 w-full border-[0px] " :class="{
                'rounded-bl-none rounded-br-none border-[0px] border-b-[0px] scale-x-105 text-xl': selectedItemId === item.id
            }" @click="toggleItem(item.id)">
                <!-- Circle in the top-right corner -->
                <div :class="{
                    'hidden': selectedItemId === item.id
                }" v-if="isItemAdded(item.id)"
                    class="absolute top-1 border-[0px] left-1 h-5 w-5 text-black bg-emerald-500 border-yellow-500 flex items-center justify-center rounded-full text-sm">
                    {{ getItemQuantity(item.id) }}
                </div>
                <div
                    class="absolute top-1  right-1  text-green-500  border-yellow-500 flex items-center justify-center rounded-full text-sm">
                    <Icon icon="ri:heart-line" height="15" />
                </div>

                <div class="flex gap-3 justify-start ">
                    <!-- Image with Overlay -->
                    <div class="w-16 h-16">
                        <img :src="item.imageUrl" alt="Menu Item" class="w-full h-full object-cover rounded"
                            v-if="item.imageUrl && !failedImages[item.id]" @error="() => handleImageError(item.id)" />
                        <img v-else src="@/assets/pics/fallback.jpg" alt="Default Menu Item"
                            class="w-full h-full object-cover rounded" />

                        <!-- Full Image Overlay -->
                        <!-- <div class="absolute inset-0 bg-black opacity-20 rounded" :class="{
                            'hidden': selectedItemId === item.id
                        }"></div>

                        <div class="absolute inset-0 flex items-center justify-center" :class="{
                            'hidden': selectedItemId === item.id
                        }">
                            <div
                                class="text-white text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center text-yellow-500">
                                2
                            </div>
                        </div> -->
                    </div>


                    <!-- Item Name -->
                    <span class="self-center">{{ item.name }}</span>
                </div>
                <span class="self-center">P{{ item.price }}</span>
            </div>

            <div v-if="selectedItemId === item.id"
                class="flex flex-col bg-surface-700 pb-2 rounded-bl-lg rounded-br-lg border-[0px] border-t-[0px] px-2 py-1 scale-x-105 border-yellow-500">
                <div class="flex gap-1 mt-1 justify-center">
                    <button
                        class="rounded-lg px-2 py-1 min-w-[50%] text-white border-[1px] border-white h-[2.5rem] self-center"
                        @click="showDetails(item)">
                        Details
                    </button>

                    <div class="rounded-lg bg-emerald-500 px-2 py-1 w-full h-[2.5rem] self-center"
                        v-if="isItemAdded(item.id)">
                        <div class="flex justify-between h-full">
                            <div class="self-center rounded-lg bg-white h-6 w-6 items-center justify-center flex"
                                @click="decrementQuantity(item.id)">
                                <Icon :icon="getItemQuantity(item.id) == 1 ? 'fluent:delete-28-filled' : 'typcn:minus'"
                                    class="text-emerald-500" />
                            </div>
                            <div class="self-center font-bold">
                                {{ getItemQuantity(item.id) }}
                            </div>
                            <div class="self-center rounded-lg bg-white h-6 w-6 items-center justify-center flex"
                                @click="incrementQuantity(item.id)">
                                <Icon icon="typcn:plus" class="text-emerald-500" />
                            </div>
                        </div>
                    </div>



                    <button v-else @click="addToOrder(item)" :disabled="loading" class="rounded-lg px-2 py-1 min-w-[50%] text-white border-[1px] border-emerald-500 font-bold
            bg-emerald-500 h-[2.5rem] self-center">
                        <div v-if="loading" class="self-center flex justify-center">
                            <Icon icon="svg-spinners:3-dots-bounce" />
                        </div>
                        <div v-else class="self-center">Add to Order</div>
                    </button>
                </div>
            </div>
        </div>



    </div>



    <Dialog v-model:visible="customerVisible" modal header="Customer Tag"
        :style="{ width: '90vw', minHeight: '50%', padding: '0px', backgroundColor: '' }" position="center">

        <div class="flex flex-wrap gap-2 mt-1">
            <div v-for="(customer, index) in customerList" :key="index"
                class="rounded-full border-[1px] text-lg font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col"
                @click="selectCustomer(customer)">
                {{ customer }}
            </div>
        </div>
    </Dialog>
    <div class="fixed inset-x-0 bottom-2 w-full bg-[#203444] text-black text-center mb-[3.3rem] shadow-lg p-5"
        v-if="orderItemCount > 0">
        <button @click="orderVisible = true"
            class="rounded-lg p-2 w-full h-[3.4rem] p-0 bg-cyan-500 text-black flex justify-between items-center">
            <div class="flex gap-2 items-center">
                <div>
                    <Icon icon="dashicons:food" width="20" height="20" />
                </div>
                <div class="font-bold">
                    {{ totalUniqueItems }}
                </div>
            </div>
            <div class="flex flex-1 justify-center">
                <span class="font-bold text-black">View my order</span>
            </div>
            <div class="font-bold ml-1">
                P {{ totalOrderAmount }}
            </div>
        </button>
    </div>



    <Drawer v-model:visible="orderVisible" header="My Order" position="bottom" class="opacity-90"
        :style="{ width: '100%', height: '95vh' }">
        <div class="flex flex-col">
            <div class="flex ">
                <div class="flex gap-2  flex-1 justify-start">
                    <button @click="selectService('Dine in')"
                        :class="selectedService === 'Dine in' ? 'bg-white text-black' : 'bg-transparent text-white'"
                        class="border-[1px] border-white w-auto p-2 px-4 rounded-lg">
                        Dine in
                    </button>
                    <button @click="selectService('Take out')"
                        :class="selectedService === 'Take out' ? 'bg-white text-black' : 'bg-transparent text-white'"
                        class="border-[1px] border-white w-auto p-2 px-4 rounded-lg">
                        Take out
                    </button>
                </div>
                <div class="flex flex-1 justify-end">
                    <div v-if="!selectedCustomer" @click="customerVisible = true"
                        class="rounded-full text-lgs font-bold h-[2rem] w-[33%] self-center flex justify-center items-center flex-col bg-whste text-white-500 border-white-500">
                        <Icon icon="mdi:user-add" height="25" />
                    </div>
                    <div v-else
                        class="rounded-xl border-[1px] text-lg font-bold h-[2.5rem] w-[33%] self-center flex justify-center items-center text-black font-bold bg-white border-whites"
                        @click="customerVisible = true">
                        {{ selectedCustomer }}
                    </div>
                </div>


            </div>
            <div class=" h-[56vh] mt-5 w-full overflow-auto mb-4">
                <div v-for="(detail, index) in orderDetails" :key="detail.id">
                    <div :class="['flex py-3 px-1', index % 2 === 0 ? 'bg-surface-800' : '']">
                        <div class="self-center">
                            <img :src="detail.imageUrl" alt="Menu Item"
                                class="self-center w-[4rem] h-[4rem] rounded-lg border-[1px] border-yellow-500 p-[1px] object-cover"
                                v-if="detail.imageUrl && !failedImages[detail.id]"
                                @error="() => handleImageError(detail.id)" />
                            <img v-else src="@/assets/pics/fallback.jpg" alt="Default Menu Item"
                                class="self-center w-[4rem] h-[4rem] rounded-lg border-[1px] border-yellow-500 p-[1px] object-cover" />
                        </div>
                        <div class="flex flex-col w-full">
                            <div class="">
                                <div class="flex justify-between px-2">
                                    <div class="flex text-xl font-bold self-center gap-2">
                                        <div>{{ detail.name }}</div>
                                    </div>
                                    <div class="flex flex-col items-end">
                                        <!-- <div class="text-sm italic">Subtotal</div> -->
                                        <div class="text-lg">P{{ detail.subtotal }}</div>
                                    </div>
                                </div>
                                <div class="flex justify-between  h-full">
                                    <div class="flex px-2 w-1/2 gap-1  opacity-60 self-start">
                                        <div class="text ">Price:</div>
                                        <div class="">P{{ detail.price }}</div>
                                    </div>
                                    <div class="flex px-2 w-1/2 self-start">
                                        <button class="w-full">
                                            <div
                                                class="rounded-full bg-transparent border-[1px] border-white px-2 py-1 w-full h-[2rem] self-center">
                                                <div class="flex justify-between h-full">
                                                    <div class="self-center rounded-lg  h-6 w-6 items-center justify-center flex"
                                                        @click="decrementQuantity(detail.menu_item_id)">
                                                        <Icon
                                                            :icon="getItemQuantity(detail.menu_item_id) == 1 ? 'fluent:delete-28-filled' : 'typcn:minus'"
                                                            class="" />
                                                    </div>
                                                    <div class="self-center font-bold">
                                                        {{ detail.quantity }}
                                                    </div>
                                                    <div class="self-center rounded-full h-6 w-6 items-center justify-center flex"
                                                        @click="incrementQuantity(detail.menu_item_id)">
                                                        <Icon icon="typcn:plus" class="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="flex gap-2 flex-col ">
                <div class="flex justify-between px-4">
                    <div class="font-bold text-xl">
                        Total:
                    </div>
                    <div class="font-bold text-2xl">
                        P {{ totalOrderAmount }}
                    </div>

                </div>
                <button class="bg-emerald-500 w-full h-[3rem] rounded-xl font-bold flex justify-center"
                    @click="confirmOrder">
                    <div class="flex self-center gap-2">
                        <Icon icon="ic:outline-payments" height="20" />
                        <div>Confirm Order</div>
                    </div>
                </button>
            </div>
        </div>
    </Drawer>

    <Drawer v-model:visible="detailsVisible" header="Item Details" position="bottom" class="opacity-90"
        :style="{ width: '100%', minHeight: '65vh', height: 'auto' }">
        <div v-if="selectedItem">
            <div>
                <div class="w-full bg-white justify-center flex rounded-lg py-3 mb-2">
                    <img :src="selectedItem.imageUrl" alt="Menu Item" class="h-[20vh] w-auto"
                        v-if="selectedItem.imageUrl && !failedImages[selectedItem.id]"
                        @error="() => handleImageError(selectedItem.id)" />
                    <img v-else src="@/assets/pics/fallback.jpg" alt="Default Menu Item" class="h-[20vh] w-auto" />
                </div>
                <div class="text-2xl font-bold">{{ selectedItem.name }}</div>
                <!-- <div class="text-yellow-500 flex gap-1">
                            <Icon v-for="index in starsDisplay.fullStars" :key="'full-' + index" icon="ic:round-star"
                                height="20" />
                            <Icon v-if="starsDisplay.halfStar" icon="ic:round-star-half" height="20" />
                            <Icon v-for="index in starsDisplay.emptyStars" :key="'empty-' + index"
                                icon="ic:round-star-outline" height="20" />
                        </div> -->
                <p v-html="selectedItem.description"></p>

                <div>
                    Price: ₱{{ selectedItem.price }}
                </div>
            </div>
            <!-- Conditionally render buttons based on if item is added to order -->
            <div class="flex justify-center mt-4 mb-4">
                <div v-if="!isItemAdded(selectedItem.id)" @click="addToOrder(selectedItem)"
                    class="bg-emerald-500 justify-center p-3 rounded-lg flex w-full text-white" severity="success">
                    <Icon icon="ic:baseline-add-shopping-cart" height="20" />
                    <b>Add to Order</b>
                </div>
                <div v-else class="w-full">
                    <div class="flex justify-between gap-2 " severity="info">
                        <div class="flex-1 rounded-lg border-[1px] px-2">
                            <div class="flex justify-between h-full">
                                <div class="self-center rounded-lg bg-white h-6 w-6 items-center justify-center flex"
                                    @click="decrementQuantity(selectedItem.id)">
                                    <Icon
                                        :icon="getItemQuantity(selectedItem.id) == 1 ? 'fluent:delete-28-filled' : 'typcn:minus'"
                                        class="text-black" />
                                </div>
                                <div class="self-center font-bold">
                                    {{ getItemQuantity(selectedItem.id) }}
                                </div>
                                <div class="self-center rounded-lg bg-white h-6 w-6 items-center justify-center flex"
                                    @click="incrementQuantity(selectedItem.id)">
                                    <Icon icon="typcn:plus" class="text-black" />
                                </div>
                            </div>
                        </div>
                        <div class="bg-cyan-500 justify-center p-3 rounded-lg flex w-full text-black flex-1"
                            @click="showOrderDetails">
                            <Icon icon="ic:outline-shopping-cart" height="20" />
                            <b>My Orders</b>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </Drawer>


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
