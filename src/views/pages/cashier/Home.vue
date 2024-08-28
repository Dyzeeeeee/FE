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
    <div class="">
        <div class="flex items-center">
            <div class="mr-2 ml-4">
                <Avatar image="https://thumbs.dreamstime.com/b/vector-illustration-smiling-shark-cartoon-minimalist-flat-style-isolated-white-background-315602043.jpg" size="xlarge" shape="circle" class="custom-avatar-border" />
            </div>
            <div class="p-2 flex-1">
                <div class="flex justify-between items-center text-4xl">
                    <div class="flex-wrap">
                        <div class="flex-wrap">Good Day <span class="font-bold">Username</span></div>
                        <div class="text-xl flex"><i>Cashier</i></div>
                    </div>

                    <div class="flex flex-col items-center mr-6">
                        <div class="text-xl font-medium" style="margin-bottom: -5px">{{ dayName }}</div>
                        <div class="text-3xl font-bold" style="margin-bottom: -5px">{{ dayNumber }}</div>
                        <div class="text-base font-light">{{ monthName }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex pt-3 text-xl gap-3 h-15rem pb-3">
            <div class="flex w-6 gap-1">
                <div class="flex flex-wrap card justify-between relative w-6 h-full">
                    <!-- Button positioned absolutely within the card -->
                    <Button @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" class="absolute top-0 right-0" style="height: 30px; width: auto" text plain>
                        <Icon icon="system-uicons:menu-horizontal" width="30" height="30" />
                    </Button>
                    <!-- Content Container -->
                    <div class="flex-wrap w-10">
                        <div class="flex">Total Sales</div>
                        <div class="flex text-3xl mb-3">100 orders</div>
                    </div>
                    <div class="flex w-2 align-self-center">
                        <Icon icon="codicon:graph" width="50" height="50" style="color: #80d4fc" />
                    </div>
                    <div class="flex w-12">
                        <Button class="w-full font-bold text-base" severity="info">
                            <Icon icon="mdi:open-in-new" width="22" height="22" />
                            Open Counter
                        </Button>
                    </div>
                </div>
                <div class="flex-wrap w-6 align-self-end">
                    <div class="flex gap-1 mb-1 h-full">
                        <Card class="w-6 h-full" style="min-height: 6rem">
                            <template #content>
                                <p class="m-0 flex-wrap">Today: 21</p>
                            </template>
                        </Card>
                        <Card class="w-6 h-full" style="min-height: 6rem">
                            <template #content>
                                <p class="m-0 flex-wrap">Yesterday: 21</p>
                            </template>
                        </Card>
                    </div>
                    <div class="flex gap-1">
                        <Card class="w-6 h-full" style="min-height: 6rem">
                            <template #content>
                                <p class="m-0 flex-wrap">This week: 21</p>
                            </template>
                        </Card>
                        <Card class="w-6 h-full" style="min-height: 6rem">
                            <template #content>
                                <p class="m-0 flex-wrap">This Month: 21</p>
                            </template>
                        </Card>
                    </div>
                </div>
            </div>

            <div class="flex w-3 gap-2">
                <div class="flex flex-wrap card justify-between relative w-full h-full">
                    <!-- Button positioned absolutely within the card -->
                    <Button @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" class="absolute top-0 right-0" style="height: 30px; width: auto" text plain>
                        <Icon icon="system-uicons:menu-horizontal" width="30" height="30" />
                    </Button>
                    <!-- Content Container -->
                    <div class="flex-wrap w-10">
                        <div class="flex">Total Customers</div>
                        <div class="flex text-3xl mb-3">100 registered</div>
                    </div>
                    <div class="flex w-2 align-self-center">
                        <Icon icon="teenyicons:users-solid" width="50" height="50" style="color: #70ec9c" />
                    </div>
                    <div class="flex w-12">
                        <Button class="w-full font-bold text-base" severity="success">
                            <Icon icon="gridicons:add-outline" width="22" height="22" />
                            Register New
                        </Button>
                    </div>
                </div>
            </div>
            <div class="flex w-3 gap-2">
                <div class="flex flex-wrap card justify-between relative w-full h-full">
                    <!-- Button positioned absolutely within the card -->
                    <Button @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" class="absolute top-0 right-0" style="height: 30px; width: auto" text plain>
                        <Icon icon="system-uicons:menu-horizontal" width="30" height="30" />
                    </Button>
                    <!-- Content Container -->
                    <div class="flex-wrap w-10">
                        <div class="flex">Rooms</div>
                        <div class="flex text-3xl mb-3">26 Guests</div>
                    </div>
                    <div class="flex w-2 align-self-center">
                        <Icon icon="teenyicons:users-solid" width="50" height="50" style="color: #c884fc" />
                    </div>
                    <div class="flex w-12">
                        <Button class="w-full font-bold text-base" severity="help">
                            <Icon icon="gridicons:add-outline" width="22" height="22" />
                            Book New
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex">
            <div class="flex gap-3 w-full">
                <div class="flex-wrap w-7 card h-30rem relative">
                    <Button @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" class="absolute top-0 right-0" style="height: 30px; width: auto" text plain>
                        <Icon icon="system-uicons:menu-horizontal" width="30" height="30" />
                    </Button>
                    <div class="text-2xl flex">This Week's Sales</div>

                    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[20rem] w-full" />
                </div>
                <div class="flex-wrap w-5 card h-30rem relative">
                    <Button @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" class="absolute top-0 right-0" style="height: 30px; width: auto" text plain>
                        <Icon icon="system-uicons:menu-horizontal" width="30" height="30" />
                    </Button>
                    <div class="text-2xl flex">Upcoming Bookings</div>
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
</style>
