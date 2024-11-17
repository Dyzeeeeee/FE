<script setup>
import axios from "axios";
import { onMounted, onUnmounted, ref } from "vue";

const itemStatus = ref(false);

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

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
    <div class="grid grid-cols-12 xl:gap-3 gap-2 -mx-5 xl:-mx-3 mb-10 mt-20">
        <div class="col-span-12 xl:col-span-12 items-center bg-surface-800 "
            :class="['fixed top-20 left-0 right-0 z-50', isRounded ? 'mt-2 p-2 shadow-md transition-all duration-300 ease-in-out' : ' top-16 bg-gray-800  p-2 transition-all duration-300 ease-in-out shadow-lg ']">
            <div class="flex gap-2 font-bold">
                <div>
                    <Button severity="success">Simple</Button>
                </div>
                <div>

                </div>
            </div>
        </div>

        <div class="col-span-6 flex flex-col gap-3">
            <div class="card h-[8rem] p-0 relative overflow-visible">
                <!-- Image Container with Overflow -->
                <div
                    class="bg-surface-900 rounded-full h-[5rem] w-[5rem] absolute -top-6 left-4 border-surface-700 border-[4px]">
                    <img src="@/assets/pics/sdrink.png" alt="" class="object-cover">
                </div>
                <!-- Category Title -->
                <div class="font-bold text-2xl p-3 mt-12">Softdrinks</div>
            </div>
        </div>
        <div class="col-span-6 flex flex-col gap-3">
            <div class="card h-[8rem] p-0 relative overflow-visible">
                <!-- Image Container with Overflow -->
                <div
                    class="bg-surface-900 rounded-full h-[5rem] w-[5rem] absolute -top-6 left-4 border-surface-700 border-[4px]">
                    <img src="@/assets/pics/sfoods.png" alt="" class="object-cover">
                </div>
                <!-- Category Title -->
                <div class="font-bold text-2xl p-3 mt-12">Seafoods</div>
            </div>
        </div>
        <div class="col-span-6 flex flex-col gap-3">
            <div class="card h-[8rem] p-0 relative overflow-visible">
                <!-- Image Container with Overflow -->
                <div
                    class="bg-surface-900 rounded-full h-[5rem] w-[5rem] absolute -top-6 left-4 border-surface-700 border-[4px]">
                    <img src="@/assets/pics/beer.png" alt="" class="object-cover">
                </div>
                <!-- Category Title -->
                <div class="font-bold text-2xl p-3 mt-12">Beer</div>
            </div>
        </div>
        <div class="col-span-6 flex flex-col gap-3">
            <div class="card h-[8rem] p-0 relative overflow-visible">
                <!-- Image Container with Overflow -->
                <div
                    class="bg-surface-900 rounded-full h-[5rem] w-[5rem] absolute -top-6 left-4 border-surface-700 border-[4px]">
                    <img src="@/assets/pics/chips.png" alt="" class="object-cover">
                </div>
                <!-- Category Title -->
                <div class="font-bold text-2xl p-3 mt-12">Chips</div>
            </div>
        </div>

    </div>


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
