<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

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
});

onUnmounted(() => {
    clearInterval(dateInterval);
});
</script>

<template>
    <div class="grid grid-cols-12 xl:gap-3 gap-2 -m-5 xl:-m-3 ">
        <div class="col-span-12 xl:col-span-12 flex items-center">
            <div class="xl:ml-4 mr-2">
                <Avatar image="https://thumbs.dreamstime.com/b/vector-illustration-smiling-shark-cartoon-minimalist-flat-style-isolated-white-background-315602043.jpg" size="xlarge" shape="circle" class="custom-avatar-border" />
            </div>
            <div class="xl:p-2 flex-1">
                <div class="flex justify-between items-center xl:text-4xl text-2xl">
                    <div class="flex-wrap">
                        <div class="flex-wrap">Good Day <span class="font-bold">Username</span></div>
                        <div class="text-base xl:text-xl flex"><i>Cashier</i></div>
                    </div>

                    <div class="flex flex-col items-center xl:mr-6">
                        <div class="text-xl font-medium" style="margin-bottom: -5px">{{ dayName }}</div>
                        <div class="text-3xl font-bold" style="margin-bottom: -5px">{{ dayNumber }}</div>
                        <div class="text-base font-light">{{ monthName }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-6 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Orders</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">520 </span>
                <span class="text-muted-color">newly registered</span>
            </div>
        </div>
        <div class="col-span-6 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Customers</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">520 </span>
                <span class="text-muted-color">newly registered</span>
            </div>
        </div>
        <div class="col-span-6 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Reservations</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">520 </span>
                <span class="text-muted-color">newly registered</span>
            </div>
        </div>
        <div class="col-span-6 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Customers</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">520 </span>
                <span class="text-muted-color">newly registered</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-8">
            <div class="card mb-0 relative">
                <Button style="height: 30px; width: auto; position: absolute; top: 0; right: 0" text plain>
                    <Icon icon="system-uicons:menu-horizontal" width="30" height="30" />
                </Button>
                <div class="text-2xl flex">This Week's Sales</div>

                <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[20rem] w-full" />
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-4">
            <div class="card mb-0 relative h-[40rem]">
                <Button style="height: 30px; width: auto; position: absolute; top: 0; right: 0" text plain>
                    <Icon icon="system-uicons:menu-horizontal" width="30" height="30" />
                </Button>
                <div class="text-2xl flex">Upcoming Bookings</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-avatar-border {
    border: 2px solid #4caf50;
    padding: 2px;
}
</style>
