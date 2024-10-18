<script setup>
import axios from "axios";
import { onMounted, onUnmounted, ref } from "vue";

const itemStatus = ref(false);
const showCustomers = ref(true);

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
    <div class="grid grid-cols-12 xl:gap-3 gap-2 -mx-5 xl:-mx-3 mb-10">
        <div class="col-span-12 xl:col-span-12 items-center bg-gray-900  "
            :class="['fixed top-0 left-0 right-0 z-[1]', isRounded ? ' p-2 shadow-md transition-all duration-300 ease-in-out' : ' top-0 bg-gray-800  p-2 transition-all duration-300 ease-in-out shadow-lg ']">
            <div class="flex flex-wrap gap-2 overflow-x-auto transition-all duration-300 ease-in-out transform"
                :class="showCustomers ? 'flex gap-2 overflow-x-auto' : 'hidden'"
                style="overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none;">
                <div class="relative max-w-[14%] overflow-x-auto">
                    <div
                        class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col bg-white border-yellow-500">
                        <Icon icon="fluent:mail-inbox-all-24-filled" height="20" class="self-center text-yellow-500" />
                    </div>
                    <!-- Overlay Badge -->
                    <div
                        class="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex justify-center items-center border-[1px] text-sm">
                        45
                    </div>
                    <div class="text-center truncate text-yellow-500">
                        All
                    </div>
                </div>
                <div class="relative max-w-[14%] overflow-x-auto">
                    <div
                        class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
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
                <div class="relative max-w-[14%] overflow-x-auto">
                    <div
                        class="rounded-full border-[3px] text-xl font-bold h-[3rem] w-[3rem] flex justify-center items-center flex-col">
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
            </div>
            <div class="flex justify-between bg-surface-700 mt-2 p-2 font-bold rounded-full">
                <!-- <div class="self-center flex-1">
                    <Button class="h-[2rem]" rounded severity="danger">Close</Button>
                </div> -->
                <div class="self-center w-1/4 justify-start flex gap-2 ">
                    <Icon icon="iconamoon:arrow-left-2-duotone" height="30" class="self-center" />
                </div>
                <div class="self-center flex-1 justify-center flex gap-2 ">
                    <Icon icon="healthicons:hot-meal" height="30" class="self-center" />
                    <div class="self-center">
                        Sizzling Plates
                    </div>
                    <div
                        class="h-6 w-6 bg-red-500 rounded-full flex justify-center items-center border-[1px] text-sm self-center">
                        10
                    </div>
                </div>
                <div class="self-center w-1/4 justify-end flex gap-2 ">
                    <Icon icon="iconamoon:arrow-right-2-duotone" height="30" class="self-center" />
                </div>
                <!-- <div class="flex-1 self-center justify-end flex">
                    3
                </div> -->
            </div>
            <div @click="showCustomers = !showCustomers"
                class="absolute left-1/2 bottom-[-20px] w-16 h-16 bg-gray-900 rounded-full z-[-1] transform -translate-x-1/2 shadow-lg flex flex-col justify-end items-center">
                <div class="flex items-center justify-center">
                    <Icon :icon="showCustomers ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" height="30" />
                </div>
            </div>

        </div>

        <div class="col-span-12 flex flex-col gap-3 " :class="showCustomers ? 'mt-36' : 'mt-20'">
            <div class="card p-0 m-0 ">
                <div class>
                    <div class="flex w-full">
                        <div class="rounded-tl-lg rounded-bl-lg bg-green-200 min-w-[4%]">

                        </div>
                        <div class="w-[96%] p-3">
                            <div class="flex-wrap text-2xl font-bold mb-2">
                                <div class="flex justify-between">
                                    <div>
                                        Order #123
                                    </div>
                                    <div
                                        class="text-green-200 rounded-full border-[1px] px-2 self-center text-base w-auto flex">
                                        <Icon icon="material-symbols:payments-outline-rounded" height="20"
                                            class="mr-1" />
                                        Paid
                                    </div>
                                </div>
                                <div class="italic flex text-xs font-normal">
                                    3mins ago
                                </div>
                            </div>


                            <div class="border-[1px] border-dashed w-full p-2">

                                <div class="flex justify-between">
                                    <div class="flex gap-1">
                                        <div>
                                            2x
                                        </div>
                                        <div class="underline">
                                            Iced Coffee Latte
                                        </div>
                                        <div class="flex self-center text-blue-300">
                                            <Icon icon="fluent:note-24-filled" height="20" class="" />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex self-center text-orange-500">
                                            <Icon icon="eos-icons:loading" height="20" class="" />
                                        </div>
                                    </div>
                                </div>




                                <div class="flex justify-between">
                                    <div class="flex gap-1">
                                        <div>
                                            1x
                                        </div>
                                        <div class="underline">
                                            Sinigang na Hipon
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex self-center text-yellow-500">
                                            <Icon icon="game-icons:hot-meal" height="20" class="" />
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-between gap-2 ">

                                </div>

                                <div class="flex justify-between">
                                    <div class="flex gap-1">
                                        <div>
                                            1x
                                        </div>
                                        <div class="underline" @click="itemStatus = true">
                                            Sinigang na Bangus
                                        </div>
                                    </div>
                                    <div class="flex self-center text-green-500">
                                        <Icon icon="line-md:check-all" height="20" class="" />
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>

                </div>

            </div>

            <div class="card p-0 m-0 ">
                <div class>
                    <div class="flex w-full">
                        <div class="rounded-tl-lg rounded-bl-lg bg-green-200 min-w-[4%]">

                        </div>
                        <div class="w-[96%] p-3">
                            <div class="flex-wrap text-2xl font-bold mb-2">
                                <div class="flex justify-between">
                                    <div>
                                        Order #126
                                    </div>
                                    <div
                                        class="text-green-200 rounded-full border-[1px] px-2 self-center text-base w-auto flex">
                                        <Icon icon="material-symbols:payments-outline-rounded" height="20"
                                            class="mr-1" />
                                        Paid
                                    </div>
                                </div>
                                <div class="italic flex text-xs font-normal">
                                    3mins ago
                                </div>
                            </div>


                            <div class="border-[1px] border-dashed w-full p-2">

                                <div class="flex justify-between">
                                    <div class="flex gap-1">
                                        <div>
                                            2x
                                        </div>
                                        <div class="underline">
                                            Iced Coffee Latte
                                        </div>
                                        <div class="flex self-center text-blue-300">
                                            <Icon icon="fluent:note-24-filled" height="20" class="" />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex self-center text-orange-500">
                                            <Icon icon="eos-icons:loading" height="20" class="" />
                                        </div>
                                    </div>
                                </div>




                                <div class="flex justify-between">
                                    <div class="flex gap-1">
                                        <div>
                                            1x
                                        </div>
                                        <div class="underline">
                                            Sinigang na Hipon
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex self-center text-yellow-500">
                                            <Icon icon="game-icons:hot-meal" height="20" class="" />
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-between gap-2 ">

                                </div>

                                <div class="flex justify-between">
                                    <div class="flex gap-1">
                                        <div>
                                            1x
                                        </div>
                                        <div class="underline" @click="itemStatus = true">
                                            Sinigang na Bangus
                                        </div>
                                    </div>
                                    <div class="flex self-center text-green-500">
                                        <Icon icon="line-md:check-all" height="20" class="" />
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>

                </div>


            </div>

            <div class="card p-0 m-0">
                <div class>
                    <div class="flex w-full">
                        <div class="rounded-tl-lg rounded-bl-lg bg-orange-200 min-w-[4%]">

                        </div>
                        <div class="w-[96%] p-3">
                            <div class="flex-wrap text-2xl font-bold mb-2">
                                <div class="flex justify-between">
                                    <div>
                                        Order #124
                                    </div>
                                    <div
                                        class="text-orange-200 rounded-full border-[1px] px-2 self-center text-base w-auto flex">
                                        <Icon icon="material-symbols:payments-outline-rounded" height="20"
                                            class="mr-1" />
                                        Pending
                                    </div>
                                </div>
                                <div class="flex justify-between">
                                    <div class="self-center italic text-xs font-normal">
                                        3mins ago
                                    </div>
                                    <div class="text-base font-normal">
                                        <span class="font-bold">
                                            Total:&nbsp;
                                        </span> P200
                                    </div>
                                </div>
                            </div>


                            <div class="border-[1px] border-dashed w-full p-2">

                                <div class="flex justify-between">
                                    <div class="flex gap-1">
                                        <div>
                                            2x
                                        </div>
                                        <div class="underline">
                                            Iced Coffee Latte
                                        </div>
                                        <div class="flex self-center text-blue-300">
                                            <Icon icon="fluent:note-24-filled" height="20" class="" />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex self-center text-orange-500">
                                            <Icon icon="eos-icons:loading" height="20" class="" />
                                        </div>
                                    </div>
                                </div>




                                <div class="flex justify-between">
                                    <div class="flex gap-1">
                                        <div>
                                            1x
                                        </div>
                                        <div class="underline">
                                            Sinigang na Hipon
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex self-center text-yellow-500">
                                            <Icon icon="game-icons:hot-meal" height="20" class="" />
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-between gap-2 ">

                                </div>

                                <div class="flex justify-between">
                                    <div class="flex gap-1">
                                        <div>
                                            1x
                                        </div>
                                        <div class="underline" @click="itemStatus = true">
                                            Sinigang na Bangus
                                        </div>
                                    </div>
                                    <div class="flex self-center text-green-500">
                                        <Icon icon="line-md:check-all" height="20" class="" />
                                    </div>
                                </div>


                            </div>

                        </div>

                    </div>

                </div>


            </div>
            <div class="card p-0 m-0">
                <div class>
                    <div class="flex w-full">
                        <div class="rounded-tl-lg rounded-bl-lg bg-red-400 min-w-[4%]">

                        </div>
                        <div class="w-[96%] p-3">
                            <div class="flex-wrap text-2xl font-bold mb-2">
                                <div class="flex justify-between">
                                    <div>
                                        Order #125
                                    </div>
                                    <div
                                        class="text-red-400 rounded-full border-[1px] px-2 self-center text-base w-auto flex">
                                        <Icon icon="material-symbols:payments-outline-rounded" height="20"
                                            class="mr-1" />
                                        Cancelled
                                    </div>
                                </div>
                                <div class="italic flex text-xs font-normal">
                                    3mins ago
                                </div>
                            </div>


                            <div class="border-[1px] border-dashed w-full p-2">

                                <div class="flex justify-between">
                                    <div class="flex gap-1">
                                        <div>
                                            2x
                                        </div>
                                        <div class="underline">
                                            Iced Coffee Latte
                                        </div>
                                        <div class="flex self-center text-blue-300">
                                            <Icon icon="fluent:note-24-filled" height="20" class="" />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex self-center text-red-500">
                                            <Icon icon="entypo:cross" height="20" class="" />
                                        </div>
                                    </div>
                                </div>




                                <div class="flex justify-between">
                                    <div class="flex gap-1">
                                        <div>
                                            1x
                                        </div>
                                        <div class="underline">
                                            Sinigang na Hipon
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex self-center text-red-500">
                                            <Icon icon="entypo:cross" height="20" class="" />
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-between gap-2 ">

                                </div>

                                <div class="flex justify-between">
                                    <div class="flex gap-1">
                                        <div>
                                            1x
                                        </div>
                                        <div class="underline" @click="itemStatus = true">
                                            Sinigang na Bangus
                                        </div>
                                    </div>
                                    <div class="flex self-center text-red-500">
                                        <Icon icon="entypo:cross" height="20" class="" />
                                    </div>
                                </div>


                            </div>

                        </div>

                    </div>

                </div>


            </div>
        </div>

    </div>

    <Dialog v-model:visible="itemStatus" modal :style="{ width: '70vw', minHeight: '25%', padding: '0px' }"
        position="center" header="Sinigang na Bangus">
        <div class="bg-blue-100 border-[1px] border-dashed p-2 text-sm text-black overflow-auto">
            <span class="font-bold">Note:&nbsp;</span>Masarap dapat ang luto hehehehe kasi kung hindi ewan
        </div>
        <div class="mt-2">
            This order item is currently being prepared, kindly wait until it is <div
                class="flex text-center  text-yellow-500"> ready to be served
                <Icon icon="game-icons:hot-meal" height="20" class="" />
            </div>
        </div>
        <div class="flex justify-end gap-2 p-0 w-full mt-2">
            <!-- <Button severity="secondary" outlined @click="itemStatus = false" class="w-[30%]"> Close</Button> -->
            <Button severity="success" @click="itemStatus = false" class="w-full">Okay</Button>
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
