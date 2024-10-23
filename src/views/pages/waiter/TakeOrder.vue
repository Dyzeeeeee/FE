<script setup>
import { baseImageUrl } from '@/config'; // Make sure the path is correct based on your project structure
import axios from "axios";
import { computed, onMounted, onUnmounted, ref } from "vue";

const itemStatus = ref(false);
const categories = ref([]);
const selectedCategoryId = ref('All');  // Initially set to 'All'
const allMenuItems = ref([]);  // Holds all menu items unfiltered
const selectedService = ref('Dine in');  // Initially set to 'All'  
const menuItems = ref([]);
const isRounded = ref(true);
const searchTerm = ref(''); // Reactive variable for search term
const selectedItemId = ref(null); // Track the currently selected item
const showCategories = ref(true);

const failedImages = ref({}); // Object to track failed image status for each item
const toggleItem = (itemId) => {
    // Toggle the currently selected item
    selectedItemId.value = selectedItemId.value === itemId ? null : itemId;
};

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

const selectedCustomer = ref('');

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
});


</script>

<template>
    <div class="grid grid-cols-12 xl:gap-3 gap-1 -mx-5 xl:-mx-3 mb-10 " :class="showCategories ? 'mt-24' : 'mt-12'">
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
                        class="rounded-full border-[1px] text-lg font-bold h-[2.5rem] w-[33%] self-center flex justify-center items-center text-white bg-yellow-500 border-whites"
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
                        :class="['min-w-[5rem] xl:min-w-[7rem] rounded-xl px-4 py-2 text-sm font-semibold', selectedCategoryId === 'All' ? 'bg-yellow-500 text-white' : 'bg-transparent border  border-white text-white']">
                        All
                    </button>

                    <button v-for="category in categories" :key="category.id" @click="filterCategory(category.id)"
                        :class="['w-auto rounded-xl px-4 py-2 text-sm font-semibold flex items-center whitespace-nowrap',
                            selectedCategoryId === category.id ? 'bg-yellow-500 text-white' : 'bg-transparent border border-white text-white']">
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
            <div class="relative flex gap-2 font-bold justify-between card p-2 m-0 w-full border-[0px] border-yellow-500"
                :class="{
                    'rounded-bl-none rounded-br-none border-[1px] border-b-[0px] scale-x-105': selectedItemId === item.id
                }" @click="toggleItem(item.id)">
                <!-- Circle in the top-right corner -->
                <div :class="{
                    'hidden': selectedItemId === item.id
                }"
                    class="absolute top-1 border-[2px] left-1 h-5 w-5 text-yellow-500 bg-white border-yellow-500 flex items-center justify-center rounded-full text-sm">
                    1
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
                <span class="self-center">${{ item.price }}</span>
            </div>

            <div v-if="selectedItemId === item.id"
                class="flex flex-col bg-surface-700 pb-2 rounded-bl-lg rounded-br-lg border-[0px] border-t-[0px] px-2 py-1 scale-x-105 border-yellow-500">
                <div class="flex gap-1 mt-1">
                    <button
                        class="rounded-lg px-2 py-1 min-w-[50%] text-white border-[1px] border-white h-[2.5rem] self-center">
                        Details
                    </button>
                    <div class="rounded-lg bg-green-500 px-2 py-1 w-full h-[2.5rem] self-center">
                        <div class="flex justify-between h-full">
                            <div class="self-center rounded-lg bg-white h-6 w-6 items-center justify-center flex">
                                <Icon icon="typcn:minus" class="text-green-500" />
                            </div>
                            <div class="self-center font-bold">5</div>
                            <div class="self-center rounded-lg bg-white h-6 w-6 items-center justify-center flex">
                                <Icon icon="typcn:plus" class="text-green-500" />
                            </div>
                        </div>
                    </div>
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
