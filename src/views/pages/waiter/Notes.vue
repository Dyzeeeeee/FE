<script setup>
import axios from "axios";
import { onMounted, onUnmounted, ref } from "vue";

const noteVisible = ref(false);
const customerID = ref('Customer ')
onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
const translateX = ref(0); // Current translation of the card
const isSlidLeft = ref(false); // Whether the card is fully slid to the left or not
const isSlidRight = ref(false); // Whether the card is fully slid to the right or not

// Variables to track touch positions
let startX = 0;  // Starting X position of the touch
let currentX = 0; // Current position during touch move
let moved = false; // If the card has been moved

// Minimum translation distance to reveal the button
// const minTranslate = 50; // Change this to a positive value for right-slide

// Handle the start of the touch event
const startTouch = (event) => {
    startX = event.touches[0].clientX;
    moved = false;
};

const resetCardPosition = () => {
    translateX.value = 0; // Reset translateX to 0
    isSlidLeft.value = false; // Reset left slide state
    isSlidRight.value = false; // Reset right slide state
};
// Handle the movement during the touch event
const moveTouch = (event) => {
    currentX = event.touches[0].clientX;
    const diffX = currentX - startX;

    // Prevent card from sliding too much in either direction
    if (diffX < 0 && translateX.value > -80) {
        // Slide to the left
        translateX.value = diffX;
        moved = true;
    } else if (diffX > 0 && translateX.value < 50) {
        // Slide to the right
        translateX.value = diffX;
        moved = true;
    }
};

// Handle the end of the touch event
const endTouch = () => {
    if (!moved) return;

    // Snap the card to full slide or back to its original position
    if (translateX.value < -50 / 2) {
        // If swiped more than halfway to the left, slide fully left
        translateX.value = -50;
        isSlidLeft.value = true;
        isSlidRight.value = false; // Reset right slide state
    } else if (translateX.value > 50 / 2) {
        // If swiped more than halfway to the right, slide fully right
        translateX.value = 50;
        isSlidRight.value = true;
        isSlidLeft.value = false; // Reset left slide state
    } else {
        // Otherwise, snap back
        translateX.value = 0;
        isSlidLeft.value = false;
        isSlidRight.value = false;
    }
};
// Mock data for available orders
const availableOrders = ['Iced Coffee', 'Latte', 'Cappuccino', 'Espresso', 'Mocha', 'Americano', 'Flat White', 'Macchiato'];

// Reactive variables
const inputValue = ref(''); // The value of the input field
const filteredOrders = ref([]); // Suggestions based on input
const selectedOrders = ref([]); // Selected orders
const quantityPattern = /^\d+x\s*/i;

// Method to filter available orders based on input value
const filterOrders = () => {
    const query = inputValue.value.toLowerCase();

    // Only filter orders if input matches "quantity + x + space"
    const match = query.match(quantityPattern);
    if (match) {
        const searchTerm = query.replace(quantityPattern, ''); // Remove the "2x " part
        filteredOrders.value = availableOrders.filter(order => order.toLowerCase().includes(searchTerm));
    } else {
        filteredOrders.value = []; // Clear suggestions if quantity format isn't met
    }
};

// Method to add selected order with quantity to chips
const addOrder = (order) => {
    const match = inputValue.value.match(quantityPattern);
    if (match) {
        const quantity = match[0].trim(); // Extract "2x"
        const orderWithQuantity = `${quantity} ${order}`;
        if (!selectedOrders.value.includes(orderWithQuantity)) {
            selectedOrders.value.push(orderWithQuantity); // Add order with quantity
        }
    }
    inputValue.value = ''; // Clear input after selection
    filteredOrders.value = []; // Clear suggestions after selection
};


// Method to remove order from chips
const removeOrder = (order) => {
    selectedOrders.value = selectedOrders.value.filter(selected => selected !== order);
};

// Method to save note (for demonstration)
const saveNote = () => {
    console.log('Selected Orders:', selectedOrders.value);
    inputValue.value = ''; // Clear input
    selectedOrders.value = []; // Clear chips
};

// Method to clear note
const clearNote = () => {
    inputValue.value = ''; // Clear input
    selectedOrders.value = []; // Clear chips
};
const chartData = ref();
const chartOptions = ref();

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


const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Satuday', 'Sunday'],
        datasets: [
            {
                type: 'bar',
                label: 'Orders',
                data: [65, 59, 80, 81, 56, 55, 40, 20],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-cyan-500')
                // tension: 0.4
            },
            {
                type: 'bar',
                label: 'Rooms',
                data: [29, 45, 9, 81, 5, 65, 56, 21],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-green-500')
                // tension: 0.4
            }
            // { type: 'bar', label: 'Second Dataset', data: [28, 48, 40, 19, 86, 27, 90], fill: false, backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),  }
        ]
    };
};
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
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
    <div class="relative">
        <!-- Main Content -->
        <div class="grid grid-cols-12 xl:gap-3 gap-2 -mx-5 xl:-mx-3 mb-10 mt-16">
            <div class="col-span-12 xl:col-span-12 items-center bg-surface-800 hidden"
                :class="['fixed top-0 left-0 right-0 z-50', isRounded ? 'mt-2 p-2 shadow-md transition-all duration-300 ease-in-out' : 'top-16 bg-gray-800 p-2 transition-all duration-300 ease-in-out shadow-lg ']">
                <div class="flex gap-2 font-bold">
                    <div class="flex justify-end w-[85%]">
                        <InputGroup>
                            <InputText placeholder="Search your notes" />
                            <Button>
                                <Icon icon="mingcute:search-line" />
                            </Button>
                        </InputGroup>
                    </div>
                    <div class="flex gap-2 w-[15%] justify-end">
                        <Button severity="info" @click="noteVisible = true">
                            <Icon icon="material-symbols:note-stack-add-sharp" height="20" />
                        </Button>
                    </div>
                </div>
            </div>

            <div class="col-span-12 flex gap-3 relative hidden">
                <div class="card-container relative w-full h-[7rem] overflow-hidden border-[1px] rounded-lg">
                    <!-- Background Card -->
                    <div class="absolute inset-0 transition-transform duration-300 transform bg-surface-900 rounded-lg">
                        <div class="flex w-full h-full justify-between">
                            <div
                                class="p-3 h-full w-[15%] flex flex-col justify-center items-center bg-red-500 rounded-tl-lg rounded-bl-lg">
                                <Icon icon="material-symbols:delete-sharp" height="40" />
                            </div>
                            <div
                                class="p-3 h-full w-[15%] flex flex-col justify-center items-center bg-green-500 rounded-tr-lg rounded-br-lg">
                                <Icon icon="mingcute:send-fill" height="40" />
                            </div>
                        </div>
                    </div>

                    <!-- Slideable Card -->
                    <div ref="cardRef" class="card h-full p-3 w-full transition-transform ease-out"
                        :style="{ transform: `translateX(${translateX}px)` }" @touchstart="startTouch"
                        @touchmove="moveTouch" @touchend="endTouch" @click="resetCardPosition" :class="{
                            'rounded-tr-none rounded-br-none pl-[18%]': isSlidLeft,
                            'rounded-tl-none rounded-bl-none pr-[18%]': isSlidRight
                        }">
                        <div class="font-bold text-2xl">Untitled Note</div>
                        <div class="truncate overflow-auto text-sm italic opacity-70">
                            09/27/2024 (3:30pm)
                        </div>
                        <div class="overflow-auto">
                            <div class="flex flex-wrap gap-2 mt-2">
                                <span v-for="(order, index) in selectedOrders.slice(0, 2)" :key="index"
                                    class="inline-flex items-center px-2 py-1 bg-yellow-200 text-black rounded-full">
                                    {{ order }}
                                </span>
                                <span v-if="selectedOrders.length > 2"
                                    class="inline-flex items-center px-2 py-1 bg-gray-300 text-black rounded-full">
                                    +{{ selectedOrders.length - 2 }} more
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Overlay -->

    </div>

    <Dialog v-model:visible="noteVisible" modal
        :style="{ width: '90vw', minHeight: '70%', padding: '0px', backgroundColor: '' }" position="center" header="">
        <div class="flex flex-col h-full p-6">
            <div class="pb-4 h-[20%]">
                <input v-model="customerID" type="text" placeholder="Enter Title..."
                    class="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-300 outline-none py-2" />
            </div>
            <div class="flex-1 relative min-h-[40vh]">
                <input type="text" v-model="inputValue" @input="filterOrders"
                    placeholder="Start typing customer's order..."
                    class="w-full h-12 bg-transparent outline-none text-lg leading-relaxed border-b border-gray-400" />
                <ul v-if="filteredOrders.length > 0"
                    class="absolute z-10 bg-surface-900 border border-gray-400 rounded-md w-full mt-1">
                    <li v-for="(order, index) in filteredOrders" :key="index" @click="addOrder(order)"
                        class="p-2 hover:bg-yellow-500 cursor-pointer">
                        {{ order }}
                    </li>
                </ul>
                <div class="flex flex-wrap gap-2 mt-4">
                    <span v-for="(order, index) in selectedOrders" :key="index"
                        class="inline-flex items-center px-2 py-1 bg-yellow-200 text-black rounded-full">
                        {{ order }}
                        <button @click="removeOrder(order)" class="ml-2 text-red-500">x</button>
                    </span>
                </div>
            </div>
            <div class="flex justify-end w-full mt-4 h-[10%]">
                <Button class="w-1/3" @click="saveNote">Save</Button>
            </div>
        </div>
    </Dialog>
    <div class="absolute inset-0 bg-opacity-100 flex items-center justify-center">
        <div class="text-center text-white text-xl font-semibold">
            <img src="@/assets/pics/CSoon.png" class="h-80" />
        </div>
    </div>
</template>

<style scoped>
.custom-avatar-border {
    border: 2px solid #4caf50;
    padding: 2px;
}
</style>
