<script setup>
import axios from "axios";
import { onMounted, onUnmounted, ref } from "vue";

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const scrollContainer = ref(null);

const scrollLeft = () => {
    scrollContainer.value.scrollBy({
        top: 0,
        left: -325, // Adjust scroll amount
        behavior: 'smooth',
    });
};

const scrollRight = () => {
    scrollContainer.value.scrollBy({
        top: 0,
        left: 325, // Adjust scroll amount
        behavior: 'smooth',
    });
};

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
const dayName = ref(new Date().toLocaleDateString('en-US', { weekday: 'short' })); // "Tue"
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
        <div class="col-span-12 hidden">
            <div class="flex justify-end gap-2">
                <div class="w-1/3">
                    <Button class="w-full">
                        <Icon icon="material-symbols-light:menu-book-sharp" height="20" width="20" />
                        Menu
                    </Button>
                </div>
                <div class="w-1/3">
                    <Button class="w-full">
                        <Icon icon="bx:qr" height="20" width="20" />
                        QR
                    </Button>
                </div>
            </div>
        </div>



        <div class="col-span-12 min-h-[25vh] max-h-[40vh] mb-2 px-8 relative">
            <button class="absolute -right-2 top-1/2 transform -translate-y-1/2 text-white" @click="scrollRight">
                <Icon icon="fe:arrow-right" width="40" height="40" class="cursor-pointer pb-2" />
            </button>
            <button class="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white" @click="scrollLeft">
                <Icon icon="fe:arrow-left" width="40" height="40" class="cursor-pointer pb-2" />
            </button>
            <div class="flex justify-center">
                1/5
            </div>
            <div class="flex gap-4 pb-0 mt-1 text-sm xl:text-9xl font-bold p-0 overflow-x-auto whitespace-nowrap "
                ref="scrollContainer" style="scrollbar-width: none; -ms-overflow-style: none;">
                <div class="card border-[2px] rounded-xl h-auto  min-w-[80vw] m-0  border-yellow-500  p-0 ">
                    <div class=" w-full">
                        <div
                            class="border-b-[0px] text-yellow-600 border-[2px] font-bold text-xl flex justify-between bg-yellow-200 rounded-t-lg p-2 border-yellow-500">
                            <div class="flex">
                                <div class="self-center">
                                    <Icon icon="game-icons:hot-meal" height="20" />
                                </div>
                                <div class="self-end">
                                    Ready to be Served
                                </div>
                            </div>
                            <div>
                                <button
                                    class="flex justify-center gap-2 h-[2rem] w-[2rem] rounded-full border-[1px] border-gray-500 text-gray-500 hover:border-green-500 hover:text-green-500 hover:bg-green-200">
                                    <div class="self-center">
                                        <Icon icon="entypo:check" height="20" class="" />

                                    </div>
                                </button>
                            </div>
                        </div>
                        <!-- <Divider class="text-white" /> -->
                        <div class="p-4">
                            <div class="font-bold text-xl flex ">
                                Customer AB
                            </div>
                            <div class="overflow-auto max-h-[10vh] min-h-[10vh]">
                                <div class="flex justify-between">
                                    <div>
                                        Iced Coffee Latte
                                    </div>
                                    <div>
                                        X1
                                    </div>
                                </div>
                                <div class="flex justify-between">
                                    <div>
                                        Iced Coffee Latte
                                    </div>
                                    <div>
                                        X1
                                    </div>
                                </div>
                            </div>
                            <div
                                class="flex bg-orange-300 rounded-full mt-4 p-2 border-dashed border-[1px] border-black  overflow-auto  text-black">
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
                </div>
                <div class="card border-[2px] rounded-xl h-auto  min-w-[80vw] m-0  border-yellow-500  p-0 ">
                    <div class=" w-full">
                        <div
                            class="border-b-[0px] text-yellow-600 border-[2px] font-bold text-xl flex justify-between bg-yellow-200 rounded-t-lg p-2 border-yellow-500">
                            <div class="flex">
                                <div class="self-center">
                                    <Icon icon="game-icons:hot-meal" height="20" />
                                </div>
                                <div class="self-end">
                                    Ready to be Served
                                </div>
                            </div>
                            <div>
                                <button
                                    class="flex justify-center gap-2 h-[2rem] w-[2rem] rounded-full border-[1px] border-gray-500 text-gray-500 hover:border-green-500 hover:text-green-500 hover:bg-green-200">
                                    <div class="self-center">
                                        <Icon icon="entypo:check" height="20" class="" />

                                    </div>
                                </button>
                            </div>
                        </div>
                        <!-- <Divider class="text-white" /> -->
                        <div class="p-4">
                            <div class="font-bold text-xl flex ">
                                Customer AB
                            </div>
                            <div class="overflow-auto max-h-[10vh] min-h-[10vh]">
                                <div class="flex justify-between">
                                    <div>
                                        Iced Coffee Latte
                                    </div>
                                    <div>
                                        X1
                                    </div>
                                </div>
                                <div class="flex justify-between">
                                    <div>
                                        Iced Coffee Latte
                                    </div>
                                    <div>
                                        X1
                                    </div>
                                </div>
                            </div>
                            <div
                                class="flex bg-orange-300 rounded-full mt-4 p-2 border-dashed border-[1px] border-black  overflow-auto  text-black">
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
                </div>
                <div class="card border-[2px] rounded-xl h-auto  min-w-[80vw] m-0  border-yellow-500  p-0 ">
                    <div class=" w-full">
                        <div
                            class="border-b-[0px] text-yellow-600 border-[2px] font-bold text-xl flex justify-between bg-yellow-200 rounded-t-lg p-2 border-yellow-500">
                            <div class="flex">
                                <div class="self-center">
                                    <Icon icon="game-icons:hot-meal" height="20" />
                                </div>
                                <div class="self-end">
                                    Ready to be Served
                                </div>
                            </div>
                            <div>
                                <button
                                    class="flex justify-center gap-2 h-[2rem] w-[2rem] rounded-full border-[1px] border-gray-500 text-gray-500 hover:border-green-500 hover:text-green-500 hover:bg-green-200">
                                    <div class="self-center">
                                        <Icon icon="entypo:check" height="20" class="" />

                                    </div>
                                </button>
                            </div>
                        </div>
                        <!-- <Divider class="text-white" /> -->
                        <div class="p-4">
                            <div class="font-bold text-xl flex ">
                                Customer AB
                            </div>
                            <div class="overflow-auto max-h-[10vh] min-h-[10vh]">
                                <div class="flex justify-between">
                                    <div>
                                        Iced Coffee Latte
                                    </div>
                                    <div>
                                        X1
                                    </div>
                                </div>
                                <div class="flex justify-between">
                                    <div>
                                        Iced Coffee Latte
                                    </div>
                                    <div>
                                        X1
                                    </div>
                                </div>
                            </div>
                            <div
                                class="flex bg-orange-300 rounded-full mt-4 p-2 border-dashed border-[1px] border-black  overflow-auto  text-black">
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
                </div>
            </div>

        </div>

        <div class="col-span-12 h-auto mb-2">
            <div class="flex gap-3 justify-center ">
                <button
                    class="flex flex-col justify-center items-center bg-white text-black border-black border-[2px]  h-[5rem] w-[30%] rounded-xl font-bold hover:bg-yellow-200 hover:text-black hover:border-yellow-500">
                    <div>
                        <Icon icon="fluent-mdl2:activate-orders" height="20" class="" />
                    </div>
                    <div>
                        Orders List
                    </div>
                </button>
                <button
                    class="flex flex-col justify-center items-center bg-white text-black border-black border-[2px]  h-[5rem] w-[30%] rounded-xl font-bold hover:bg-yellow-200 hover:text-black hover:border-yellow-500">
                    <div>
                        <Icon icon="hugeicons:menu-restaurant" height="20" class="" />
                    </div>
                    <div>
                        Take Order
                    </div>
                </button>
                <button
                    class="flex flex-col justify-center items-center bg-white text-black border-black border-[2px]  h-[5rem] w-[30%] rounded-xl font-bold hover:bg-yellow-200 hover:text-black hover:border-yellow-500">
                    <div>
                        <Icon icon="gg:qr" height="30" class="" />
                    </div>
                    <div>
                        Scan QR
                    </div>
                </button>
            </div>
        </div>

        <div class="col-span-12 h-[30vh]">
            <div class="card border-[1px] h-full p-3">
                <div class="flex text-2xl font-bold mb-2">
                    Active Customers
                </div>
                <div class="flex flex-wrap gap-2 overflow-auto max-h-[20vh]">

                    <div class="relative">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                            AB
                        </div>
                        <!-- Overlay Badge -->
                        <div
                            class="absolute top-0 right-0 h-4 w-4 bg-yellow-500 rounded-full flex justify-center items-center border-[1px]">
                            <Icon icon="fluent:alert-16-filled" width="10" height="10" class="text-white" />
                        </div>
                    </div>
                    <div class="relative">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                            B
                        </div>
                        <!-- Overlay Badge -->
                        <div
                            class="absolute top-0 right-0 h-4 w-4 bg-green-500 rounded-full flex justify-center items-center border-[1px]">
                            <Icon icon="lets-icons:check-fill" width="10" height="10" class="text-white" />
                        </div>
                        <div
                            class="absolute bottom-0 left-0 h-4 w-4 bg-blue-500 rounded-full flex justify-center items-center border-[1px]">
                            <Icon icon="tabler:rosette-discount" width="10" height="10" class="text-white" />
                        </div>
                    </div>
                    <div class="relative">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                            C
                        </div>
                        <!-- Overlay Badge -->
                        <div
                            class="absolute top-0 right-0 h-4 w-4 bg-orange-500 rounded-full flex justify-center items-center border-[1px]">
                            <Icon icon="bx:time" width="10" height="10" class="text-white" />
                        </div>
                    </div>
                    <div class="relative">
                        <div
                            class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                            D
                        </div>
                        <!-- Overlay Badge -->
                        <div
                            class="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex justify-center items-center border-[1px]">
                            <Icon icon="humbleicons:exclamation" width="10" height="10" class="text-white" />
                        </div>
                    </div>
                    <div
                        class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                        E
                    </div>
                    <div
                        class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                        FG
                    </div>
                    <div
                        class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                        G
                    </div>
                    <div
                        class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                        H
                    </div>
                    <div
                        class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                        I
                    </div>
                    <div
                        class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                        J
                    </div>
                    <div
                        class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
                        K
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
