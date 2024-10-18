<script setup>
import axios from "axios";
import { onMounted, onUnmounted, ref } from "vue";

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
const itemStatus = ref(false);

const chartData = ref();
const chartOptions = ref();


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
    <div class="grid grid-cols-12 xl:gap-3 gap-2 -m-5 xl:-m-3 mb-10 mt-1">
        <div class="col-span-12 xl:col-span-12 flex items-center">
            <div class="xl:ml-4 mr-2">
                <Avatar
                    image="https://thumbs.dreamstime.com/b/vector-illustration-smiling-shark-cartoon-minimalist-flat-style-isolated-white-background-315602043.jpg"
                    size="xlarge" shape="circle" class="custom-avatar-border" />
            </div>
            <div class="xl:p-2 flex-1">
                <div class="flex justify-between items-center xl:text-4xl text-2xl">
                    <div class="flex-wrap">
                        <div class="flex-wrap">Good Day <span class="font-bold">{{ userData.firstname }}!</span></div>
                        <div class="text-base xl:text-xl flex"><i>{{ userData.role }}</i></div>
                    </div>

                    <div class="flex flex-col items-center xl:mr-6">
                        <div class="text-xl font-medium" style="margin-bottom: -5px">{{ dayName }}</div>
                        <div class="text-3xl font-bold" style="margin-bottom: -5px">{{ dayNumber }}</div>
                        <div class="text-base font-light">{{ monthName }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 min-h-[30vh] max-h-[40vh] mb-2 z-[1]">
            <div class="h-full flex gap-4 pb-0 text-sm xl:text-9xl font-bold p-0 overflow-x-auto whitespace-nowrap "
                style="scrollbar-width: none; -ms-overflow-style: none;">
                <div
                    class="relative card border-[1px] rounded-xl h-full bg-gray-200 min-w-[80vw] m-0 text-black ml-8 p-4">
                    <button
                        class="absolute top-1 left-0 justify-center gap-2  rounded-full px-2 border-red-500 text-red-500 hover:border-red-500 hover:text-red-500">

                        <div class="self-center flex">
                            <Icon icon="ic:sharp-cancel" height="20" class="self-center" />
                        </div>
                    </button>

                    <div class=" w-full">
                        <div class="text-gray-700 font-bold text-xl flex justify-between">
                            <div class="flex-wrap ml-7">
                                <div class="flex ">
                                    <div class="self-center">
                                        <Icon icon="ic:round-mode-standby" height="20" class="text-secondary" />
                                    </div>
                                    <div class="self-center">
                                        Pending
                                    </div>
                                </div>

                                <div class="flex text-sm text-gray-600 opacity-70">
                                    3min ago
                                </div>
                            </div>
                            <div class="">
                                <button
                                    class="flex justify-center gap-2  rounded-full border-[1px] px-2 border-gray-500 text-gray-500 hover:border-orange-500 hover:text-orange-500">
                                    <div class="self-center flex">
                                        <div class="self-center">Start</div>
                                        <Icon icon="mingcute:fire-line" height="20" class="self-center" />

                                    </div>
                                </button>
                            </div>
                        </div>
                        <Divider class="text-white" />
                        <div class="font-bold text-xl flex justify-between">
                            <div>
                                Customer AB
                            </div>
                            <div class="text-base">
                                Order #123
                            </div>
                        </div>
                        <div class="overflow-auto max-h-[7vh] min-h-[7vh] text-xl">
                            <div class="flex justify-between bg-white px-2 border-[1px] border-black">
                                <div class="flex self-center ">
                                    <Icon icon="cil:drink" height="20" class="self-center" />
                                    Iced Coffee Latte
                                </div>
                                <div>
                                    X1
                                </div>
                            </div>
                            <div class="opacity-50 italic flex justify-between text-base px-2">
                                Note about the food
                            </div>

                        </div>
                        <div
                            class="flex bg-white  rounded-full mt-4 p-2 border-dashed border-[1px] border-black  overflow-auto  ">
                            <div class="font-bold">Note:&nbsp; </div>
                            <div class="font-normal truncate">
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                            </div>


                        </div>
                    </div>
                </div>
                <div
                    class="card border-[1px] rounded-xl h-full bg-orange-200 min-w-[80vw] m-0 text-black mr-8 p-4 relative">
                    <button
                        class="absolute top-1 left-0 justify-center gap-2  rounded-full px-2 border-red-500 text-red-500 hover:border-red-500 hover:text-red-500">

                        <div class="self-center flex">
                            <Icon icon="ic:sharp-cancel" height="20" class="self-center" />
                        </div>
                    </button>
                    <div class=" w-full">
                        <div class="text-orange-500 font-bold text-xl flex justify-between">
                            <div class="flex-wrap ml-7">
                                <div class="flex">
                                    <div class="self-center">
                                        <Icon icon="mingcute:fire-line" height="20" />
                                    </div>
                                    <div class="self-end">
                                        Preparing
                                    </div>
                                </div>
                                <div class="flex text-sm text-gray-600 opacity-70">
                                    3min ago
                                </div>
                            </div>
                            <div class=" ">
                                <button
                                    class="flex justify-center gap-2  rounded-full border-[1px] px-2 border-gray-500 text-gray-500 hover:border-yellow-500 hover:text-yellow-500">
                                    <div class="self-center flex">
                                        <div class="self-center">Ready</div>
                                        <Icon icon="game-icons:hot-meal" height="20" class="self-center" />
                                    </div>

                                </button>

                            </div>
                        </div>
                        <Divider class="text-white" />
                        <div class="font-bold text-lg flex justify-between">
                            <div>
                                Customer AB
                            </div>
                            <div class="text-base">
                                Order #123
                            </div>
                        </div>
                        <div class="overflow-auto max-h-[7vh] min-h-[7vh] text-xl">
                            <div class="flex justify-between bg-white px-2 border-[1px] border-black">
                                <div class="flex self-center ">
                                    <Icon icon="cil:drink" height="20" class="self-center" />
                                    Iced Coffee Latte
                                </div>
                                <div>
                                    X1
                                </div>
                            </div>
                            <div class="opacity-50 italic flex justify-between text-base px-2">
                                Note about the food
                            </div>

                        </div>
                        <!-- <div
                            class="flex bg-orange-300 rounded-full mt-4 p-2 border-dashed border-[1px] border-black  overflow-auto  ">
                            <div class="font-normal truncate">
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                                No ice for the Iced Coffee Latte
                            </div>


                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 min-h-[30vh] h-auto">
            <div class="card border-[1px] h-full p-3">
                <div class="flex text-2xl font-bold mb-2 gap-2">
                    <div>
                        Orders Summary
                    </div>
                    <div
                        class="h-8 w-8 bg-red-500 rounded-full flex justify-center items-center border-[1px] text-base">
                        45
                    </div>
                </div>
                <div class="flex flex-wrap gap-3 overflow-auto ">

                    <div class="relative max-w-[18%] overflow-x-auto">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[4rem] w-[4rem] flex justify-center items-center flex-col">
                            <Icon icon="cil:drink" height="20" class="self-center" />
                        </div>
                        <!-- Overlay Badge -->
                        <div
                            class="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex justify-center items-center border-[1px] text-sm">
                            15
                        </div>
                        <div class="text-center truncate">
                            Drinks
                        </div>
                    </div>
                    <div class="relative max-w-[18%] overflow-x-auto">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[4rem] w-[4rem] flex justify-center items-center flex-col">
                            <Icon icon="maki:restaurant-seafood" height="20" class="self-center" />
                        </div>
                        <!-- Overlay Badge -->
                        <div
                            class="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex justify-center items-center border-[1px] text-sm">
                            10
                        </div>
                        <div class="text-center truncate ">
                            Seafoods
                        </div>
                    </div>
                    <div class="relative max-w-[18%] overflow-x-auto">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[4rem] w-[4rem] flex justify-center items-center flex-col">
                            <Icon icon="healthicons:hot-meal" height="20" class="self-center" />
                        </div>
                        <!-- Overlay Badge -->
                        <div
                            class="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex justify-center items-center border-[1px] text-sm">
                            10
                        </div>
                        <div class="text-center truncate">
                            Sizzling Plates
                        </div>
                    </div>
                    <div class="relative max-w-[18%] overflow-x-auto">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[4rem] w-[4rem] flex justify-center items-center flex-col">
                            <Icon icon="healthicons:hot-meal" height="20" class="self-center" />
                        </div>
                        <!-- Overlay Badge -->
                        <div
                            class="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex justify-center items-center border-[1px] text-sm">
                            10
                        </div>
                        <div class="text-center truncate">
                            Sizzling Plates
                        </div>
                    </div>
                    <div class="relative max-w-[18%] overflow-x-auto">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[4rem] w-[4rem] flex justify-center items-center flex-col">
                            <Icon icon="healthicons:hot-meal" height="20" class="self-center" />
                        </div>
                        <!-- Overlay Badge -->
                        <div
                            class="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex justify-center items-center border-[1px] text-sm">
                            10
                        </div>
                        <div class="text-center truncate">
                            Sizzling Plates
                        </div>
                    </div>
                    <div class="relative max-w-[18%] overflow-x-auto">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[4rem] w-[4rem] flex justify-center items-center flex-col">
                            <Icon icon="healthicons:hot-meal" height="20" class="self-center" />
                        </div>
                        <!-- Overlay Badge -->
                        <div
                            class="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex justify-center items-center border-[1px] text-sm">
                            10
                        </div>
                        <div class="text-center truncate">
                            Sizzling Plates
                        </div>
                    </div>
                    <div class="relative max-w-[18%] overflow-x-auto">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[4rem] w-[4rem] flex justify-center items-center flex-col">
                            <Icon icon="healthicons:hot-meal" height="20" class="self-center" />
                        </div>
                        <!-- Overlay Badge -->
                        <div
                            class="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex justify-center items-center border-[1px] text-sm">
                            10
                        </div>
                        <div class="text-center truncate">
                            Sizzling Plates
                        </div>
                    </div>
                    <div class="relative max-w-[18%] overflow-x-auto">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[4rem] w-[4rem] flex justify-center items-center flex-col">
                            <Icon icon="mdi:chips" height="20" class="self-center" />
                        </div>
                        <!-- Overlay Badge -->
                        <div
                            class="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex justify-center items-center border-[1px] text-sm">
                            10
                        </div>
                        <div class="text-center truncate">
                            Chips
                        </div>
                    </div>


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
