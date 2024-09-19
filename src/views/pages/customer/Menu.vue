<script setup>
import { baseImageUrl } from '@/config'; // Make sure the path is correct based on your project structure
import { useLayout } from '@/layout/composables/layout';
import axios from 'axios';
import QrcodeVue from 'qrcode.vue';

import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
const text = ref('AIVR12345'); // Default text to show in the QR code
const timerRef = ref(null);

function generateRandomQR() {
    const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    text.value = `AIVR${randomNumber}`;
}
const { toggleDarkMode, isDarkTheme } = useLayout();

const formattedTime = computed(() => {
    const minutes = Math.floor(countdown.value / 60);
    const seconds = countdown.value % 60;
    return `${padTime(minutes)}:${padTime(seconds)}`;
});

function padTime(time) {
    return time.toString().padStart(2, '0');
}

let intervalId = null
const isFavorited = ref(false);
const categories = ref([]);
const selectedCategoryId = ref('All');  // Initially set to 'All'
const allMenuItems = ref([]);  // Holds all menu items unfiltered
const menuItems = ref([]);  // Holds items currently being displayed
const orderId = ref(null);
const QRcodeVisible = ref(false);
const countdown = ref(600); // Countdown time in seconds (10 minutes)


const filterCategory = (categoryId) => {
    selectedCategoryId.value = categoryId;  // Update the selected category ID
    menuItems.value = categoryId === 'All'
        ? allMenuItems.value
        : allMenuItems.value.filter(item => item.category_id === categoryId);
};

const createOrder = async (userId) => {
    try {
        generateRandomQR();
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


const addToOrder = async (menuItem) => {
    const userId = sessionStorage.getItem('userId');
    orderId.value = localStorage.getItem('orderId');
    if (!orderId.value) {
        await createOrder(userId);  // Create a new order if none exists
    }
    if (orderId.value) {
        try {
            console.log(orderId.value)
            console.log('first try')
        } catch (error) {
            console.error('Error adding item to order:', error);
        }
    }
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

function setQRVisibility(visible) {
    QRcodeVisible.value = visible;
    if (visible) {
        if (timerRef.value) {
            clearTimeout(timerRef.value);  // Clear any existing timer
        }
        // Set a new timer
        timerRef.value = setTimeout(() => {
            QRcodeVisible.value = false;
        }, 600000); // 600000 milliseconds = 10 minutes
    } else if (timerRef.value) {
        clearTimeout(timerRef.value);  // Clear the timer when dialog is manually closed
    }
}


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
function toggleFavorite() {
    isFavorited.value = !isFavorited.value;
}

watchEffect(() => {
    if (QRcodeVisible.value) {
        if (intervalId !== null) {
            clearInterval(intervalId); // Clear existing timer if it exists
        }
        countdown.value = 600; // Reset countdown
        intervalId = setInterval(() => {
            if (countdown.value > 0) {
                countdown.value--;
            } else {
                clearInterval(intervalId);
                intervalId = null;
                QRcodeVisible.value = false;
            }
        }, 1000); // Update countdown every second
    } else {
        if (intervalId !== null) {
            clearInterval(intervalId); // Clear the timer when dialog is manually closed
            intervalId = null;
        }
    }
});

const visible = ref(false);

watch(visible, (newValue) => {
    if (newValue) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
});

onMounted(async () => {

    getCategories();
    getMenu();
    console.log(menuItems.value)

});

onUnmounted(() => {
    if (intervalId !== null) {
        clearInterval(intervalId); // Ensure no dangling interval on component unmount
    }
});

</script>

<template>
    <!-- <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
        <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
    </button> -->
    <div class="flex text-xl font-bold pt-4 pb-5 pl-4">
        MENU
    </div>
    <Button>Open Camera</Button>
    <div class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold"
        style="overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none;">
        <Icon icon="fe:arrow-left" width="50" height="50" @click="scrollToLeft"
            class="cursor-pointer pb-2  hidden xl:block" />
        <div ref="scrollContainer"
            class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold relative overflow-x-auto whitespace-nowrap"
            style="scrollbar-width: none; -ms-overflow-style: none;">

            <Button rounded :outlined="selectedCategoryId !== 'All'" @click="filterCategory('All')" size="small"
                class="min-w-[5rem] xl:min-w-[7rem]">
                All
            </Button>
            <Button v-for="category in categories" :key="category.id" :outlined="selectedCategoryId !== category.id"
                rounded class="min-w-[7rem] xl:min-w-[7rem]" size="small" @click="filterCategory(category.id)">
                {{ category.name }}
            </Button>
        </div>
        <Icon icon="fe:arrow-right" width="50" height="50" @click="scrollToRight"
            class="cursor-pointer pb-2 hidden xl:block" />
    </div>

    <div class="grid grid-cols-12 xl:gap-4 gap-4 mt-5 pb-12 mb-12">

        <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 gap-2" v-for="item in menuItems" :key="item.id">
            <div class="card p-0 h-auto pb-5 mx-2 mb-4">
                <div class="flex relative ">
                    <div class="text-3xl p-2 absolute bg-red-500 rounded-r-lg  font-bold bottom-3">
                        ₱{{ item.price }}
                    </div>
                    <img :src="item.imageUrl" class="object-cover xl:h-[20vh] h-[20vh] w-full rounded-t-lg" />

                </div>
                <div class="flex  pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                    <div class="xl:w-2/12"></div>
                    <div class="xl:w-70 flex-1 flex-wrap">
                        <div class="flex justify-between w-full">
                            <div class="flex flex-col">
                                <div class="text-2xl font-bold xl:text-4xl">{{ item.name }}</div>
                                <div class="text-sm italic xl:text-lg">10-15 minutes</div>
                            </div>
                            <div class="self-center px-4">
                                <Button size="small" rounded @click="addToOrder(item)">
                                    Add to Order
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-3">
        <Badge value="3" severity="danger" style="position: absolute; top: 0; right: 0; z-index: 99;">
        </Badge>
        <Button @click="visible = true" severity="info"
            style="border-radius: 9999px; width: 13rem; height: 5rem; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top: 0.5rem; position: relative;">
            <div class="flex flex-col items-center">
                <div class="flex justify-center">
                    <Icon icon="ic:baseline-shopping-cart" width="20" height="20" />
                    <span class="ml-1 font-bold">My order</span>
                </div>
            </div>

            <!-- PrimeVue Badge Component with custom styling for positioning -->

        </Button>


    </div>


    <Drawer v-model:visible="visible" header="My Order" position="bottom" class="opacity-90"
        :style="{ width: '100%', height: '85vh' }">
        <div class="flex flex-col h-full ">
            <div class="flex-grow overflow-auto">
                <div class="grid grid-cols-12 mb-4">
                    <div class="col-span-12 mb-2">
                        <div class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold"
                            style="overflow-x: auto; white-space: no-wrap;">
                            <Button rounded class="min-w-[5rem] xl:min-w-[10rem]"> Dine in</Button>
                            <Button outlined rounded class="min-w-[5rem] xl:min-w-[10rem]">Take
                                out</Button>
                        </div>
                    </div>
                    <div class="col-span-12 mb-2 bg-">
                        <Divider />
                        <div class="flex gap-2 ml-3">
                            <div class="font-bold text-xl self-center flex-grow">
                                Iced Coffee
                            </div>
                            <div class="self-center flex-wrap text-lg  text-end px-4">
                                <div class="text-sm italic">
                                    Subtotal:
                                </div>
                                <div class="font-bold">P100</div>
                                <!-- Price, assuming a currency filter -->
                            </div>
                        </div>
                        <div class="flex gap-2 pt-2 justify-between mr-3">
                            <div class="flex items-center w-1/3 h-full ml-3">
                                <div class="text-sm mr-1 font-bold">
                                    Price:
                                </div>
                                <div class="text-base italic">
                                    P1922
                                </div>
                            </div>
                            <div style="width: 30%; height: 30px" class="">
                                <Button severity="danger" class="w-full h-full" size="small">
                                    <!-- <Icon icon="clarity:remove-solid" width="15" height="15" /> -->
                                    <div class="font-bold ">Remove</div>
                                </Button>
                            </div>
                            <div style="width: 40%;">
                                <InputGroup class="w-full " style="height: 30px ">
                                    <Button severity="primary" size="small" class="w-4/12 h-full">
                                        <Icon icon="ic:sharp-minus" width="15" height="15" />
                                    </Button>
                                    <InputText placeholder="0" class="h-full" />
                                    <Button severity=" primary" size="small" class="w-4/12 h-full">
                                        <Icon icon="ic:sharp-plus" width="15" height="15" />
                                    </Button>
                                </InputGroup>
                            </div>

                        </div>

                        <Divider />


                    </div>
                </div>
            </div>
            <div class="w-full">
                <div class="flex-wrap mb-3 gap-2">
                    <div class="flex mb-3">
                        <div class="flex justify-start px-4 ">
                            <span class="font-bold text-xl self-center">Total Price</span>
                        </div>
                        <div class="flex-1 text-end gap-2 align-self-end ">
                            <span class="font-bold text-2xl pr-4">P 1000</span>
                        </div>
                    </div>
                    <div class="flex justify-center">
                        <div class="flex-1 text-end gap-2 justify-center flex ">
                            <Button severity="success" class="w-full xl:w-auto" @click="setQRVisibility(true)">
                                <Icon icon="ic:baseline-payments" width="20" height="20" />
                                <div class="font-bold">Confirm Order</div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Drawer>


    <Dialog v-model:visible="QRcodeVisible" modal :style="{ width: '90vw', height: '80%' }" position="center"
        header="Order QR Code" @update:visible="setQRVisibility">

        <div class="flex w-full text-center">
            <div class="text-2xl font-bold  w-full">AIVR12345</div>
        </div>
        <div class="flex justify-center mt-4">
            <qrcode-vue :value="text" :size="270" :level="'H'"></qrcode-vue>
        </div>
        <div class="italic mt-2 text-light text-sm">
            <span class="italic mt-2 text-light text-sm">Let any staff from <span class="font-bold">Anahaw Island View
                    Resort</span> scan your QR code or let them know about the code above the QR. </span> <span
                class="text-red-500">&nbspNauubusan ito ng time para
                maexpire yung order kasi madaming baka omorder lang kahit malayo</span>
        </div>

        <div v-if="QRcodeVisible" class="flex">
            <span class="font-bold">Time Remaining: </span>
            <p>&nbsp;{{ formattedTime }}</p>
        </div>
    </Dialog>

</template>

<style scoped>
.item-border {
    border: 2px solid #a7af4c;
    padding: 2px;
}
</style>
