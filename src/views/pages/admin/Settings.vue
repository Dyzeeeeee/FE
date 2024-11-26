<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const products = ref([]);

const getPercentage = (quantity, ideal) => (quantity / ideal) * 100;

const getBarColor = (percentage) => {
    if (percentage <= 30) return 'red';
    else if (percentage <= 70) return 'orange';
    else return 'green';
};

onMounted(async () => {
    try {
        const response = await axios.get('/get-food-stocks');
        products.value = response.data;
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
});
</script>




<template>
    <div class="grid grid-cols-12 gap-3 -m-3">
        <div class="col-span-12 lg:col-span-6 xl:col-span-12 xl:m-0 h-[80vh] flex flex-col justify-between">
            Settings
        </div>
    </div>
</template>

<style scoped>
.progress-bar {
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 3px;
}

.progress-bar-value {
    height: 20px;
    line-height: 20px;
    color: white;
    text-align: center;
    border-radius: 3px;
}
</style>