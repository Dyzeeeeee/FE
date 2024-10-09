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
        <div class="col-span-12 xl:col-span-12 items-center bg-surface-800"
            :class="['fixed top-20 left-0 right-0 z-50', isRounded ? 'mt-2 p-2 shadow-md transition-all duration-300 ease-in-out' : ' top-16 bg-gray-800  p-2 transition-all duration-300 ease-in-out shadow-lg ']">
            <div class="flex gap-2 font-bold">
                <div class="flex gap-2 w-[30%]">
                    <Button severity="success">
                        <Icon icon="ph:funnel-simple-fill" height="20" />
                    </Button>
                    <Button severity="info">
                        <Icon icon="mdi:user-add" height="20" />
                    </Button>
                </div>
                <!-- <div class="flex-1">

                </div> -->
                <div class="flex justify-end w-[70%]">
                    <InputGroup>
                        <InputText placeholder="Search the menu" />
                        <Button>
                            <Icon icon="mingcute:search-line" />
                        </Button>
                    </InputGroup>
                </div>
            </div>
            <div class="flex gap-2 pb-0 text-sm xl:text-9xl font-bold mt-2"
                style="overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none;">
                <Icon icon="fe:arrow-left" width="50" height="50" @click="scrollToLeft"
                    class="cursor-pointer pb-2  hidden xl:block" />
                <div ref="scrollContainer"
                    class="flex gap-2 pb-0 text-sm xl:text-9xl font-bold relative overflow-x-auto whitespace-nowrap "
                    style="scrollbar-width: none; -ms-overflow-style: none;">

                    <Button rounded size="small" class="min-w-[5rem] xl:min-w-[7rem]">
                        <div class="px-1 flex gap-1">
                            <div>
                                <Icon icon="rivet-icons:check-all" height="20" />
                            </div>
                            <div>
                                All
                            </div>
                        </div>
                    </Button>
                    <Button rounded size="small" class="min-w-[7rem]" outlined>
                        <div class="px-1 flex gap-1">
                            <div>
                                <Icon icon="ep:cold-drink" height="20" />
                            </div>
                            <div>
                                Cold Drinks
                            </div>
                        </div>
                    </Button>
                    <Button rounded size="small" class="min-w-[7rem]" outlined>
                        <div class="px-1 flex gap-1">
                            <div>
                                <Icon icon="maki:restaurant-seafood" height="20" />
                            </div>
                            <div>
                                Seafoods
                            </div>
                        </div>
                    </Button>

                </div>
                <Icon icon="fe:arrow-right" width="50" height="50" @click="scrollToRight"
                    class="cursor-pointer pb-2 hidden xl:block" />
            </div>
        </div>
        <div class="col-span-12 flex gap-3 mb-3">

        </div>
        <div class="col-span-6 flex gap-3">
            <div class="font-bold card p-2 w-full">
                <div class="text-2xl py-2">Iced Coffee </div>
                <div class="w-full flex gap-2">
                    <Button class="w-1/2" outlined severity="info">
                        Details
                    </Button>
                    <Button class="w-1/2">
                        Add
                    </Button>
                </div>
            </div>
        </div>
        <div class="col-span-6 flex gap-3">
            <div class="font-bold card p-2 w-full">
                <div class="text-2xl py-2">Iced Coffee </div>
                <div class="w-full flex gap-2">
                    <Button class="w-1/2" outlined severity="info">
                        Details
                    </Button>
                    <Button class="w-1/2">
                        Add
                    </Button>
                </div>
            </div>
        </div>
        <div class="col-span-6 flex gap-3">
            <div class="font-bold card p-2 w-full">
                <div class="text-2xl py-2">Iced Coffee </div>
                <div class="w-full flex gap-2">
                    <Button class="w-1/2" outlined severity="info">
                        Details
                    </Button>
                    <Button class="w-1/2">
                        Add
                    </Button>
                </div>
            </div>
        </div>
        <div class="col-span-6 flex gap-3">
            <div class="font-bold card p-2 w-full">
                <div class="text-2xl py-2">Iced Coffee </div>
                <div class="w-full flex gap-2">
                    <Button class="w-1/2" outlined severity="info">
                        Details
                    </Button>
                    <Button class="w-1/2">
                        Add
                    </Button>
                </div>
            </div>
        </div>
        <div class="col-span-6 flex gap-3">
            <div class="font-bold card p-2 w-full">
                <div class="text-2xl py-2">Iced Coffee </div>
                <div class="w-full flex gap-2">
                    <Button class="w-1/2" outlined severity="info">
                        Details
                    </Button>
                    <Button class="w-1/2">
                        Add
                    </Button>
                </div>
            </div>
        </div>
        <div class="col-span-6 flex gap-3">
            <div class="font-bold card p-2 w-full">
                <div class="text-2xl py-2">Iced Coffee </div>
                <div class="w-full flex gap-2">
                    <Button class="w-1/2" outlined severity="info">
                        Details
                    </Button>
                    <Button class="w-1/2">
                        Add
                    </Button>
                </div>
            </div>
        </div>
        <div class="col-span-6 flex gap-3">
            <div class="font-bold card p-2 w-full">
                <div class="text-2xl py-2">Iced Coffee </div>
                <div class="w-full flex gap-2">
                    <Button class="w-1/2" outlined severity="info">
                        Details
                    </Button>
                    <Button class="w-1/2">
                        Add
                    </Button>
                </div>
            </div>
        </div>
        <div class="col-span-6 flex gap-3">
            <div class="font-bold card p-2 w-full">
                <div class="text-2xl py-2">Iced Coffee </div>
                <div class="w-full flex gap-2">
                    <Button class="w-1/2" outlined severity="info">
                        Details
                    </Button>
                    <Button class="w-1/2">
                        Add
                    </Button>
                </div>
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
