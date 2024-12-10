<script setup>
import axios from 'axios';
import { LineController } from 'chart.js'; // Import the line controller

import { CategoryScale, Chart, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const totalSales = computed(() => {
    // Sum up all total_price values in orders
    return orders.value.reduce((sum, order) => {
        const price = parseFloat(order.total_price.replace(/[^\d.-]/g, '')) || 0; // Handle formatting
        return sum + price;
    }, 0);
});

const printTable = () => {
    const originalContents = document.body.innerHTML;
    // const table = document.querySelector('.datatable').outerHTML;

    // Set the document body to only include the table
    // document.body.innerHTML = `
    //     <div class="print-container">
    //         <h1 class="text-center mb-4">Sales Report</h1>
    //         ${table}
    //     </div>
    // `;
    window.print();

    // Restore the original content after printing
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload to ensure scripts reinitialize
};

const totalOrders = computed(() => {
    return orders.value.length;
});
const loading = ref(false); // Track if the process is in progress

const rotationClass = ref(''); // This will hold the rotation class

const rotateIcon = async () => {
    if (loading.value) return; // Prevent action if already loading
    loading.value = true; // Set loading state to true

    rotationClass.value = 'rotate'; // Apply rotation class
    setTimeout(() => {
        rotationClass.value = ''; // Remove the rotation class after animation ends
    }, 1000);

    try {
        if (selectedDate.value) {
            const date = new Date(selectedDate.value);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(date.getDate()).padStart(2, '0'); // Get local day of the month
            const formattedDate = `${year}-${month}-${day}`;
            console.log(formattedDate);
        } else {
            console.log('No date selected');
        }

        await getAllOrders();
        await calculateOrdersPercentageChange();
        await calculatePercentageChange();

        await nextTick(() => {
            renderChart();
        });
    } catch (error) {
        console.error('Error during process:', error);
    } finally {
        loading.value = false; // Reset loading state when done
    }
};

const percentageChange = ref(''); // Reactive state to store the percentage change

const calculatePercentageChange = async () => {
    if (totalOrders.value === 0) {
        console.log('No orders available.'); // Debug log for no orders
        percentageChange.value = 'No data available'; // Handle case when no data is available
        return;
    }

    // Helper function to format a Date object to 'YYYY-MM-DD'
    const formatToDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
        return `${year}-${month}-${day}`;
    };

    // Define "today" and "yesterday" dates
    const today = new Date(selectedDate.value);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayFormatted = formatToDateString(today);
    const yesterdayFormatted = formatToDateString(yesterday);

    console.log('Today:', todayFormatted);
    console.log('Yesterday:', yesterdayFormatted);

    // Fetch orders from the API
    let todayOrders = [];
    let yesterdayOrders = [];

    try {
        const response = await axios.get('/get-orders'); // Your API endpoint here
        if (response.data) {
            // Filter orders for today and yesterday
            todayOrders = response.data.filter((order) => {
                const orderDate = new Date(order.updated_at);
                const orderDateString = orderDate.toISOString().split('T')[0]; // Format order date as 'YYYY-MM-DD'
                return orderDateString === todayFormatted && order.status === 'paid';
            });

            yesterdayOrders = response.data.filter((order) => {
                const orderDate = new Date(order.updated_at);
                const orderDateString = orderDate.toISOString().split('T')[0]; // Format order date as 'YYYY-MM-DD'
                return orderDateString === yesterdayFormatted && order.status === 'paid';
            });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }

    console.log("Today's Orders:", todayOrders);
    console.log("Yesterday's Orders:", yesterdayOrders);

    // Calculate total sales for today and yesterday
    const totalTodaySales = todayOrders.reduce((sum, order) => sum + parseFloat(order.total_price.replace(/[^\d.-]/g, '')) || 0, 0);
    const totalYesterdaySales = yesterdayOrders.reduce((sum, order) => sum + parseFloat(order.total_price.replace(/[^\d.-]/g, '')) || 0, 0);

    console.log('Total Sales Today:', totalTodaySales);
    console.log('Total Sales Yesterday:', totalYesterdaySales);

    // Avoid division by zero
    if (totalYesterdaySales === 0) {
        console.log("Yesterday's sales are zero. Percentage change cannot be calculated.");
        percentageChange.value = 'N/A';
        return;
    }

    // Calculate percentage change
    const change = ((totalTodaySales - totalYesterdaySales) / totalYesterdaySales) * 100;

    // Log the final percentage change
    console.log('Percentage Change:', change.toFixed(2));

    // Set the calculated percentage change
    percentageChange.value = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
};

const percentageOrderChange = ref(''); // Reactive state to store the percentage change

const calculateOrdersPercentageChange = async () => {
    if (totalOrders.value === 0) {
        console.log('No orders available.'); // Debug log for no orders
        percentageOrderChange.value = 'No data available'; // Handle case when no data is available
        return;
    }

    // Helper function to format a Date object to 'YYYY-MM-DD'
    const formatToDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
        return `${year}-${month}-${day}`;
    };

    // Define "today" and "yesterday" dates
    const today = new Date(selectedDate.value);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayFormatted = formatToDateString(today);
    const yesterdayFormatted = formatToDateString(yesterday);

    console.log('Today:', todayFormatted);
    console.log('Yesterday:', yesterdayFormatted);

    // Fetch orders from the API
    let todayOrders = [];
    let yesterdayOrders = [];

    try {
        const response = await axios.get('/get-orders'); // Your API endpoint here
        if (response.data) {
            // Filter orders for today and yesterday
            todayOrders = response.data.filter((order) => {
                const orderDate = new Date(order.updated_at);
                const orderDateString = orderDate.toISOString().split('T')[0]; // Format order date as 'YYYY-MM-DD'
                return orderDateString === todayFormatted && order.status === 'paid';
            });

            yesterdayOrders = response.data.filter((order) => {
                const orderDate = new Date(order.updated_at);
                const orderDateString = orderDate.toISOString().split('T')[0]; // Format order date as 'YYYY-MM-DD'
                return orderDateString === yesterdayFormatted && order.status === 'paid';
            });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }

    console.log("Today's Orders:", todayOrders);
    console.log("Yesterday's Orders:", yesterdayOrders);

    // Calculate the number of orders for today and yesterday
    const totalTodayOrders = todayOrders.length;
    const totalYesterdayOrders = yesterdayOrders.length;

    console.log('Total Orders Today:', totalTodayOrders);
    console.log('Total Orders Yesterday:', totalYesterdayOrders);

    // Avoid division by zero
    if (totalYesterdayOrders === 0) {
        console.log("Yesterday's orders are zero. Percentage change cannot be calculated.");
        percentageOrderChange.value = 'N/A';
        return;
    }

    // Calculate percentage change
    const change = ((totalTodayOrders - totalYesterdayOrders) / totalYesterdayOrders) * 100;

    // Log the final percentage change
    console.log('Percentage Change:', change.toFixed(2));

    // Set the calculated percentage change
    percentageOrderChange.value = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
};

const arrowIcon = computed(() => {
    if (percentageChange.value.startsWith('+')) {
        return 'cuida:arrow-up-outline';
    } else if (percentageChange.value.startsWith('-')) {
        return 'cuida:arrow-down-outline';
    }
    return null; // No arrow for default case
});

const textColor = computed(() => {
    if (percentageOrderChange.value.startsWith('+')) {
        return 'text-green-500 border-green-500';
    } else if (percentageOrderChange.value.startsWith('-')) {
        return 'text-red-500 border-red-500';
    }
    return 'text-gray-500'; // Default color for 'No data available' or 'N/A'
});

const orderArrowIcon = computed(() => {
    if (percentageChange.value.startsWith('+')) {
        return 'cuida:arrow-up-outline';
    } else if (percentageChange.value.startsWith('-')) {
        return 'cuida:arrow-down-outline';
    }
    return null; // No arrow for default case
});

const orderTextColor = computed(() => {
    if (percentageOrderChange.value.startsWith('+')) {
        return 'text-green-500 border-green-500';
    } else if (percentageOrderChange.value.startsWith('-')) {
        return 'text-red-500 border-red-500';
    }
    return 'text-gray-500'; // Default color for 'No data available' or 'N/A'
});

import { onUnmounted } from 'vue';

// Optional: Clean up the chart instance when the component is unmounted
onUnmounted(() => {
    if (chartInstance.value) {
        chartInstance.value.destroy(); // Destroy the chart instance
        chartInstance.value = null; // Set the chart instance reference to null
    }
});

const calendarDialog = ref(false);
const closeCalendar = async () => {
    if (selectedDate.value) {
        const date = new Date(selectedDate.value);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0'); // Get local day of the month
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate);
    } else {
        console.log('No date selected');
    }
    await getAllOrders();
    await calculateOrdersPercentageChange();
    await calculatePercentageChange();
    await nextTick(() => {
        renderChart();
    });
    calendarDialog.value = false;
};

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
const selectedDate = ref(new Date()); // Default selected date

const orders = ref([]);
const salesChart = ref(null); // Reference to the canvas element

// Function to fetch all orders
// Function to fetch all orders
const getAllOrders = async () => {
    try {
        const response = await axios.get('/get-orders'); // Your API endpoint here
        if (response.data) {
            // Ensure selectedDate is in 'YYYY-MM-DD' format
            const formattedSelectedDate = (() => {
                const date = new Date(selectedDate.value);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
                return `${year}-${month}-${day}`;
            })();

            // Filter orders for the selected date and status 'paid'
            orders.value = response.data.filter((order) => {
                const orderDate = new Date(order.updated_at);
                const orderDateString = orderDate.toISOString().split('T')[0]; // Format order date as 'YYYY-MM-DD'
                return orderDateString === formattedSelectedDate && order.status === 'paid';
            });
            // calculatePercentageChange();
            console.log('Orders for selected date with status "paid":', orders.value); // Log the filtered orders
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

// Function to render the chart
const chartInstance = ref(null); // Keep track of the Chart.js instance

const renderChart = () => {
    const salesData = new Array(15).fill(0); // Initialize an array for each hour (8 AM - 10 PM)

    // Loop through the orders and calculate the total price per hour
    orders.value.forEach((order) => {
        const orderDate = new Date(order.updated_at);
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

    // Destroy the previous chart instance if it exists
    if (chartInstance.value) {
        chartInstance.value.destroy();
    }

    // Check if the canvas is rendered and available
    if (salesChart.value) {
        const ctx = salesChart.value.getContext('2d');
        chartInstance.value = new Chart(ctx, {
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
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 500 // Adjust the y-axis step size
                        }
                    }
                }
            }
        });
    } else {
        console.error('Canvas element not found!');
    }
};

// Optional: Clean up the chart instance when the component is unmounted
onBeforeUnmount(() => {
    if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
    }
});

// Function to set the selected mode

// OnMounted lifecycle hook
onMounted(async () => {
    if (loading.value) return; // Prevent execution if already loading
    loading.value = true; // Set loading state to true

    try {
        if (selectedDate.value) {
            const date = new Date(selectedDate.value);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(date.getDate()).padStart(2, '0'); // Get local day of the month
            const formattedDate = `${year}-${month}-${day}`;
            console.log(formattedDate);
        } else {
            console.log('No date selected');
        }

        await getAllOrders();
        await calculateOrdersPercentageChange();
        await calculatePercentageChange();

        await nextTick(() => {
            renderChart();
        });
    } catch (error) {
        console.error('Error during mounted process:', error);
    } finally {
        loading.value = false; // Reset loading state when done
    }
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
const selectMode = async (mode) => {
    selectedMode.value = mode;
    // if (mode === 'Daily') {
    //     nextTick(() => {
    //         console.log("chart: ", salesChart.value); // Ensure the canvas is now available
    //         renderChart(); // Re-render the chart
    //     });
    // }
    if (loading.value) return; // Prevent execution if already loading
    loading.value = true; // Set loading state to true

    try {
        if (selectedDate.value) {
            const date = new Date(selectedDate.value);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(date.getDate()).padStart(2, '0'); // Get local day of the month
            const formattedDate = `${year}-${month}-${day}`;
            console.log(formattedDate);
        } else {
            console.log('No date selected');
        }

        await getAllOrders();
        await calculateOrdersPercentageChange();
        await calculatePercentageChange();

        await nextTick(() => {
            renderChart();
        });
    } catch (error) {
        console.error('Error during mounted process:', error);
    } finally {
        loading.value = false; // Reset loading state when done
    }
};

const showModes = ref(true);

// Array for month names
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Array for day names
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Get the day of the week and format the date
const dateObj = new Date(selectedDate.value);
const month = months[dateObj.getMonth()]; // Get the month
const day = dateObj.getDate(); // Get the day of the month

// Format the date as 'Nov. 18'

const dayOfWeek = computed(() => {
    const date = new Date(selectedDate.value);
    return date.toLocaleString('en-US', { weekday: 'long' }); // Get the full weekday name
});

const formattedDate = computed(() => {
    const date = new Date(selectedDate.value);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options); // Format as e.g. "Nov. 18"
});

// Function to dynamically generate sales data based on orders
</script>

<template>
    <div class="grid grid-cols-12 -mx-5 mb-10 mt-1">
        <div class="col-span-12 xl:col-span-12 items-center bg-gray-900"
            :class="['fixed top-0 left-0 right-0 z-[1]', isRounded ? 'shadow-md transition-all duration-300 ease-in-out' : ' top-0 bg-gray-800  p-2 transition-all duration-300 ease-in-out shadow-lg ']">
            <div class="flex gap-2 overflow-x-auto transition-all duration-300 ease-in-out transform bg-whsite"
                :class="showModes ? 'flex gap-2 overflow-x-auto' : 'hidden'"
                style="overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none">
                <div class="flex bg-surface-900 m-3 mt-2 rounded-lg w-full">
                    <!-- Daily -->
                    <div :class="['col-span-3 flex gap-3 font-bold flex-1 border-[1px] h-full relative p-2 justify-center', 'rounded-tl-lg rounded-bl-lg', selectedMode === 'Daily' ? 'bg-white text-surface-900' : 'bg-surface-900 text-white']"
                        @click="selectMode('Daily')">
                        Daily
                    </div>
                    <!-- Weekly -->
                    <div :class="['col-span-3 flex gap-3 font-bold flex-1 border-[1px] h-full relative p-2 justify-center', selectedMode === 'Weekly' ? 'bg-white text-surface-900' : 'bg-surface-900 text-white']"
                        @click="selectMode('Weekly')">
                        Weekly
                    </div>
                    <!-- Monthly -->
                    <div :class="['col-span-3 flex gap-3 font-bold flex-1 border-[1px] h-full relative p-2 justify-center', 'rounded-tr-lg rounded-br-lg', selectedMode === 'Monthly' ? 'bg-white text-surface-900' : 'bg-surface-900 text-white']"
                        @click="selectMode('Monthly')">
                        Monthly
                    </div>
                </div>
            </div>
            <div class="flex justify-between w-full p-0 font-bold rounded-full">
                <div class="flex px-4 py-2 justify-between w-full">
                    <div class="flex gap-2 mx-3">
                        <div class="flex flex-col">
                            <div class="text-sm italic opacity-80 -mb-2">{{ dayOfWeek }}</div>
                            <div class="text-xl font-bold">{{ formattedDate }}</div>
                        </div>
                        <div class="self-center">
                            <button class="flex items-center justify-center" @click="calendarDialog = true">
                                <Icon icon="material-symbols:edit-calendar" height="25" />
                            </button>
                        </div>
                    </div>
                    <div class="flex justify-end flex-1 px-4 gap-2">
                        <button @click="printTable" class="self-center">
                            <Icon icon="material-symbols:print" height="30" />
                        </button>
                        <button @click="rotateIcon" class="self-center" ref="refreshButton">
                            <Icon icon="bx:refresh" height="30" :class="rotationClass" />
                        </button>
                    </div>
                    <div>
                        <Dialog v-model:visible="calendarDialog" header="Select Date" :modal="true" :closable="true"
                            showEffect="fade" hideEffect="fade">
                            <DatePicker v-model="selectedDate" inline class="w-full sm:w-[30rem]" />
                            <div class="w-full flex justify-end">
                                <button @click="closeCalendar"
                                    class="p-2 m-2 rounded-lg bg-yellow-500 text-black flex gap-2">
                                    <Icon icon="tdesign:check" />
                                    <div>Select Date</div>
                                </button>
                            </div>
                        </Dialog>
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
                    <div class="flex-1 h-[15vh]">
                        <div class="card border-[1px] h-full p-3 flex flex-col justify-center">
                            <div class="flex gap-2 items-center">
                                <div class="">
                                    <Icon icon="tdesign:money" height="40" />
                                </div>
                                <div class="flex flex-col">
                                    <div class="font-bold text-2xl">
                                        {{ totalSales.toLocaleString('en-US', { style: 'currency', currency: 'PHP' }) }}
                                    </div>

                                    <div class="opacity-60 italic text-sm">Total Sales</div>
                                </div>
                            </div>
                            <div class="flex gap-1 text-xs" :class="textColor">
                                <Icon :icon="arrowIcon" class="bg-transparent border-[1px] rounded-full self-center"
                                    :class="textColor" height="13" />
                                <div>{{ percentageChange || 'No data available' }} (from yesterday)</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 h-[15vh]">
                        <div class="card border-[1px] h-full p-3 flex flex-col justify-center">
                            <div class="flex gap-2 items-center">
                                <div class="">
                                    <Icon icon="material-symbols-light:fastfood-sharp" height="40" />
                                </div>
                                <div class="flex flex-col">
                                    <div class="font-bold text-2xl">
                                        {{ totalOrders }}
                                    </div>
                                    <div class="opacity-60 italic text-sm">Total Orders</div>
                                </div>
                            </div>
                            <div class="flex gap-1 text-xs" :class="orderTextColor">
                                <Icon :icon="orderArrowIcon"
                                    class="bg-transparent border-[1px] rounded-full self-center" :class="orderTextColor"
                                    height="13" />
                                <div>{{ percentageOrderChange || 'No data available' }} (from yesterday)</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 h-auto">
                    <div class="card border-[1px] h-full p-3">
                        <DataTable class="datatable" :value="orders" stripedRows tableStyle="" headerClass="text-sm"
                            :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]">
                            <Column field="id" header="Order#" headerClass="text-sm" bodyClass="text-sm"></Column>
                            <Column field="total_price" header="Total" headerClass="text-sm" bodyClass="text-sm">
                            </Column>
                            <Column field="tendered" header="Tendered" headerClass="text-sm" bodyClass="text-sm">
                            </Column>
                            <Column field="change1" header="Change" headerClass="text-sm" bodyClass="text-sm"></Column>
                            <Column field="updated_at" header="Date" headerClass="text-sm" bodyClass="text-sm">
                                <template #body="slotProps">
                                    {{ formatDate(slotProps.data.updated_at) }}
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<style scoped>
/* Add some hover effect for better interaction */

.rotate {
    animation: rotateAnimation 1s ease-in-out;
}

@keyframes rotateAnimation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(-360deg);
    }
}

@media print {
    body {
        margin: 0;
        font-family: Arial, sans-serif;
        color: black;
    }

    .print-container {
        margin: 20px;
    }

    .print-container h1 {
        font-size: 24px;
        text-align: center;
        margin-bottom: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
    }

    .paginator,
    .self-center {
        display: none;
    }
}

/* Example additional styles if needed */
</style>
