<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

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
                        <div class="text-xl flex"><i>Admin</i></div>
                    </div>

                    <div class="flex flex-col items-center mr-6">
                        <div class="text-xl font-medium" style="margin-bottom: -5px">{{ dayName }}</div>
                        <div class="text-3xl font-bold" style="margin-bottom: -5px">{{ dayNumber }}</div>
                        <div class="text-base font-light">{{ monthName }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center py-3">
            <div class="text-4xl">What would you like to view?</div>
        </div>

        <div class="flex flex-wrap pt-5 gap-4">
            <Card class="flex-1 basis-1/3 max-w-[32%]">
                <template #title>
                    <div class="flex justify-center items-center">
                        <Icon icon="f7:graph-square-fill" width="7rem" height="7rem" />
                    </div>
                    <div class="text-center pt-4">DASHBOARD</div>
                </template>
            </Card>
            <Card class="flex-1 basis-1/3 max-w-[32%]">
                <template #title>
                    <div class="flex justify-center items-center">
                        <Icon icon="medical-icon:restaurant" width="7rem" height="7rem" />
                    </div>
                    <div class="text-center pt-4">RESTAURANT</div>
                </template>
            </Card>
            <Card class="flex-1 basis-1/3 max-w-[32%]">
                <template #title>
                    <div class="flex justify-center items-center">
                        <Icon icon="mingcute:hotel-fill" width="7rem" height="7rem" />
                    </div>
                    <div class="text-center pt-4">RESORT</div>
                </template>
            </Card>
            <Card class="flex-1 basis-1/3 max-w-[32%]">
                <template #title>
                    <div class="flex justify-center items-center">
                        <Icon icon="material-symbols:inventory-2-rounded" width="7rem" height="7rem" />
                    </div>
                    <div class="text-center pt-4">INVENTORY</div>
                </template>
            </Card>
            <Card class="flex-1 basis-1/3 max-w-[32%]">
                <template #title>
                    <div class="flex justify-center items-center">
                        <Icon icon="clarity:employee-group-solid" width="7rem" height="7rem" />
                    </div>
                    <div class="text-center pt-4">EMPLOYEE</div>
                </template>
            </Card>
            <Card class="flex-1 basis-1/3 max-w-[32%]">
                <template #title>
                    <div class="flex justify-center items-center">
                        <Icon icon="icomoon-free:profile" width="7rem" height="7rem" />
                    </div>
                    <div class="text-center pt-4">PROFILE</div>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped>
.custom-avatar-border {
    border: 2px solid #4caf50;
    padding: 2px;
}
</style>
