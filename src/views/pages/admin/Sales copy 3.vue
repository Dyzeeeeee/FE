<template>
    <div class="grid grid-cols-12  -mx-5  mb-10 mt-1">
        <div class="col-span-12 xl:col-span-12 items-center bg-gray-900  "
            :class="['fixed top-0 left-0 right-0 z-[1]', isRounded ? 'shadow-md transition-all duration-300 ease-in-out' : ' top-0 bg-gray-800  p-2 transition-all duration-300 ease-in-out shadow-lg ']">
            <div class="flex gap-2 overflow-x-auto transition-all duration-300 ease-in-out transform bg-whsite"
                :class="showModes ? 'flex gap-2 overflow-x-auto' : 'hidden'"
                style="overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none;">

                <div class="flex bg-surface-900 m-3 mt-2 rounded-lg w-full">
                    <!-- Daily -->
                    <div :class="[
                        'col-span-3 flex gap-3 font-bold flex-1 border-[1px] h-full relative p-2 justify-center',
                        'rounded-tl-lg rounded-bl-lg',
                        selectedMode === 'Daily' ? 'bg-white text-surface-900' : 'bg-surface-900 text-white'
                    ]" @click="selectMode('Daily')">
                        Daily
                    </div>
                    <!-- Weekly -->
                    <div :class="[
                        'col-span-3 flex gap-3 font-bold flex-1 border-[1px] h-full relative p-2 justify-center',
                        selectedMode === 'Weekly' ? 'bg-white text-surface-900' : 'bg-surface-900 text-white'
                    ]" @click="selectMode('Weekly')">
                        Weekly
                    </div>
                    <!-- Monthly -->
                    <div :class="[
                        'col-span-3 flex gap-3 font-bold flex-1 border-[1px] h-full relative p-2 justify-center',
                        'rounded-tr-lg rounded-br-lg',
                        selectedMode === 'Monthly' ? 'bg-white text-surface-900' : 'bg-surface-900 text-white'
                    ]" @click="selectMode('Monthly')">
                        Monthly
                    </div>
                </div>
            </div>
            <div class="flex justify-between w-full p-0 font-bold rounded-full">
                <div class=" flex px-4 py-2 justify-between w-full">
                    <div class="flex gap-2 mx-3">
                        <div class="flex flex-col">
                            <div class="text-sm italic opacity-80 -mb-2">{{ dayOfWeek }}</div>
                            <div class="text-xl font-bold">{{ formattedDate }}</div>
                        </div>
                        <div class="self-center ">
                            <button class="flex items-center justify-center">
                                <Icon icon="material-symbols:edit-calendar" height="25" />
                            </button>
                        </div>
                    </div>
                    <div>

                        <!-- <button class="">Filter</button> -->
                    </div>
                </div>
            </div>
            <div @click="showModes = !showModes"
                class="absolute left-1/2 bottom-[-20px] w-16 h-16 bg-gray-900 rounded-full z-[-1] transform -translate-x-1/2 shadow-lg flex flex-col justify-end items-center">
                <div class="flex items-center justify-center">
                    <Icon :icon="showModes ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" height="30" />
                </div>
            </div>
        </div>

        <template v-if="selectedMode == 'Daily'">
            <div class="col-span-12 xl:col-span-12 flex flex-col gap-2" :class="showModes ? 'mt-28' : 'mt-12'">

                <div class="w-full h-auto">
                    <div class="card border-[1px] h-full p-3">

                        <div class="flex flex-wrap gap-2 overflow-auto min-h-[35vh]">
                            <canvas ref="salesChart" width="400" height="250"></canvas>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <div class="flex-1 h-[15vh] ">
                        <div class="card border-[1px] h-full p-3 flex flex-col justify-center">
                            <div class="flex gap-2 items-center">
                                <div class="">
                                    <Icon icon="tdesign:money" height="40" />
                                </div>
                                <div class="flex flex-col">
                                    <div class="font-bold text-2xl">
                                        P5000
                                    </div>
                                    <div class="opacity-60 italic text-sm">
                                        Total Sales
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-1 text-green-500 text-xs">
                                <Icon icon="cuida:arrow-up-outline"
                                    class="bg-transparent border-[1px] border-green-500 rounded-full self-center"
                                    height="13" />
                                <div>13% (from yesterday)</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 h-[15vh] ">
                        <div class="card border-[1px] h-full p-3 flex flex-col justify-center">
                            <div class="flex gap-2 items-center">
                                <div class="">
                                    <Icon icon="material-symbols-light:fastfood-sharp" height="40" />
                                </div>
                                <div class="flex flex-col">
                                    <div class="font-bold text-2xl">
                                        100
                                    </div>
                                    <div class="opacity-60 italic text-sm">
                                        Total Orders
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-1 text-red-500 text-xs">
                                <Icon icon="cuida:arrow-down-outline"
                                    class="bg-transparent border-[1px] border-red-500 rounded-full self-center"
                                    height="13" />
                                <div>13% (from yesterday)</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 h-auto">
                    <div class="card border-[1px] h-full p-3">
                        <DataTable :value="orders" stripedRows tableStyle="" headerClass="text-sm" :paginator="true"
                            :rows="10" :rowsPerPageOptions="[5, 10, 20]">
                            <Column field="id" header="Order#" headerClass="text-sm" bodyClass="text-sm"></Column>
                            <Column field="total" header="Total" headerClass="text-sm" bodyClass="text-sm"></Column>
                            <Column field="tendered" header="Tendered" headerClass="text-sm" bodyClass="text-sm">
                            </Column>
                            <Column field="change" header="Change" headerClass="text-sm" bodyClass="text-sm"></Column>
                            <Column field="created_at" header="Date" headerClass="text-sm" bodyClass="text-sm">
                                <template #body="slotProps">
                                    {{ formatDate(slotProps.data.created_at) }}
                                </template>
                            </Column>
                        </DataTable>

                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import axios from 'axios';
import { LineController } from 'chart.js'; // Import the line controller

import { CategoryScale, Chart, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { computed, nextTick, onMounted, ref } from 'vue';

Chart.register(
    LineController, // Register the LineController
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    Filler
);
const isRounded = ref(true); // State to manage if the topbar is rounded
const selectedDate = '2024-11-21'; // Default selected date

const orders = ref([])
const salesChart = ref(null); // Reference to the canvas element

// Function to fetch all orders
// Function to fetch all orders
const getAllOrders = async () => {
    try {
        const response = await axios.get('/get-orders'); // Your API endpoint here
        if (response.data) {
            // Filter orders for the selected date and status 'paid'
            orders.value = response.data.filter(order => {
                const orderDate = new Date(order.created_at);
                const orderDateString = orderDate.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
                return orderDateString === selectedDate && order.status === 'paid'; // Add status filter
            });
            console.log('Orders for selected date with status "paid":', orders.value); // Log the filtered orders
            nextTick(() => {
                renderChart(); // Ensure DOM is updated before rendering the chart
            });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};


// Function to render the chart
const renderChart = () => {
    const salesData = new Array(15).fill(0); // Initialize an array for each hour (8 AM - 10 PM)

    // Loop through the orders and calculate the total price per hour
    orders.value.forEach(order => {
        const orderDate = new Date(order.created_at);
        const orderHour = orderDate.getHours();

        if (orderHour >= 8 && orderHour <= 22) {
            const hourIndex = orderHour - 8; // Adjust hour to match the 8 AM to 10 PM range

            // Ensure total_price is a valid number
            const totalPrice = parseFloat(order.total_price.replace(/[^\d.-]/g, '')) || 0;

            salesData[hourIndex] += totalPrice; // Add the total price to the corresponding hour
        }
    });

    // Function to format the 24-hour time to 12-hour format with AM/PM
    const formatTime = (hour) => {
        const period = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert hour to 12-hour format
        return `${formattedHour}${period}`;
    };

    console.log('Sales data for chart (hourly):', salesData); // Log the sales data calculated for each hour

    // Check if the canvas is rendered and available
    if (salesChart.value) {
        const ctx = salesChart.value.getContext('2d');
        new Chart(ctx, {
            type: 'line', // You can use 'bar' or 'line' for the chart
            data: {
                labels: Array.from({ length: 15 }, (_, index) => formatTime(index + 8)), // Labels for hours (8 AM to 10 PM)
                datasets: [
                    {
                        label: 'Total Sales',
                        data: salesData, // Sales data for each hour
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true, // Fill the area under the line
                        tension: 0.1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 500, // Adjust the y-axis step size
                        },
                    },
                },
            },
        });
    } else {
        console.error('Canvas element not found!');
    }

};

// Function to set the selected mode

// OnMounted lifecycle hook
onMounted(() => {
    console.log('Component mounted, fetching orders...');
    getAllOrders(); // Fetch all orders when the component is mounted
});


const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options); // e.g., "Nov. 21"

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const period = hours >= 12 ? 'pm' : 'am';
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${period}`; // e.g., "10:44am"

    return `${formattedDate} (${formattedTime})`;
};


// Reactive property to track the selected mode
const selectedMode = ref('Daily');

// Function to set the selected mode
const selectMode = (mode) => {
    selectedMode.value = mode;
    if (mode === 'Daily') {
        nextTick(() => {
            console.log("chart: ", dailySalesCanvas.value); // Ensure the canvas is now available
            renderChart(); // Re-render the chart
        });
    }
};
const showModes = ref(true);


// Array for month names
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Array for day names
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Get the day of the week and format the date
const dateObj = new Date(selectedDate);
const dayOfWeek = computed(() => days[dateObj.getDay()]); // Get the day of the week
const month = months[dateObj.getMonth()]; // Get the month
const day = dateObj.getDate(); // Get the day of the month

// Format the date as 'Nov. 18'
const formattedDate = computed(() => `${month}. ${day}`);

// Function to dynamically generate sales data based on orders

// Initialize the chart on component mount
onMounted(() => {
    getAllOrders();
});

</script>
