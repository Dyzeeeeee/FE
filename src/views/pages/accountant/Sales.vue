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
                            <!-- Canvas with ref -->
                            <canvas ref="dailySalesCanvas"></canvas>
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
import Chart from 'chart.js/auto';
import { computed, nextTick, onMounted, ref } from 'vue';
const isRounded = ref(true); // State to manage if the topbar is rounded
const selectedDate = '2024-11-21'; // Default selected date

const orders = ref([])

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

const dailySalesCanvas = ref(null);

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
const filterSalesByDate = (date) => {
    const filteredOrders = orders.value.filter(order => {
        const orderDate = new Date(order.created_at);
        const orderDateString = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getDate().toString().padStart(2, '0')}`;
        return orderDateString === date;
    });

    // Prepare the sales data for each hour of the day
    const hourlySales = new Array(24).fill(0); // Array to store sales for each hour (24 hours)
    filteredOrders.forEach(order => {
        const orderHour = new Date(order.created_at).getHours(); // Get the hour of the order
        hourlySales[orderHour] += order.total; // Accumulate the total sales for that hour
    });

    return {
        labels: Array.from({ length: 24 }, (_, index) => `${index}:00`), // Labels for each hour
        data: hourlySales // Sales data per hour
    };
};

const filteredData = computed(() => filterSalesByDate(selectedDate));

// Function to render the chart
const renderChart = () => {
    if (dailySalesCanvas.value) {
        const ctx = dailySalesCanvas.value.getContext('2d');
        new Chart(ctx, {
            type: 'line', // Using line chart for sales visualization
            data: {
                labels: filteredData.value.labels,
                datasets: [
                    {
                        label: 'Daily Sales (in Php)',
                        data: filteredData.value.data,
                        backgroundColor: 'yellow',
                        borderColor: 'green',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true, // Ensure y-axis starts at 0
                    },
                },
            },
        });
    }
};

// Initialize the chart on component mount
onMounted(() => {
    getAllOrders();
    renderChart();
});

</script>

<style scoped>
.p-datatable-tbody tr td {
    font-size: 0.875rem;
    /* Tailwind's `text-sm` equivalent */
    padding: 0.5rem 0.5rem;
    /* Adjust padding for smaller rows */
}
</style>