<script setup>
import { Chart } from 'chart.js';

import {
    ArcElement,
    BarController,
    BarElement,
    CategoryScale,
    Legend,
    LinearScale,
    LineController,
    LineElement, PieController,
    PointElement,
    Title, Tooltip
} from 'chart.js';
import { onMounted, onUnmounted, ref } from 'vue';

// Register necessary components of Chart.js
Chart.register(
    Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, LineElement,
    PieController, BarController, LineController, PointElement
);
// Mock Data for Charts
const pieChartData = ref({
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverOffset: 4
    }]
});

const lineChartData = ref({
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.1
    }]
});

const barChartData = ref({
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        borderWidth: 1
    }]
});

const pieChartRef = ref(null);
const lineChartRef = ref(null);
const barChartRef = ref(null);

onMounted(() => {
    // Create Pie Chart
    new Chart(pieChartRef.value, {
        type: 'pie',
        data: pieChartData.value,
    });

    // Create Line Chart
    new Chart(lineChartRef.value, {
        type: 'line',
        data: lineChartData.value,
    });

    // Create Bar Chart
    new Chart(barChartRef.value, {
        type: 'bar',
        data: barChartData.value,
    });
});

onUnmounted(() => {
    // Destroy charts when component is unmounted to avoid memory leaks
    pieChartRef.value && pieChartRef.value.destroy();
    lineChartRef.value && lineChartRef.value.destroy();
    barChartRef.value && barChartRef.value.destroy();
});
</script>

<template>
    <div class="grid grid-cols-12 xl:gap-3 gap-2 -m-5 xl:-m-3 mb-10 mt-1">
        <div class="col-span-12 xl:col-span-12">
            <!-- Pie Chart -->
            <div class="mb-6">
                <h2 class="text-xl font-bold mb-2">Pie Chart</h2>
                <canvas ref="pieChartRef"></canvas>
            </div>

            <!-- Line Chart -->
            <div class="mb-6">
                <h2 class="text-xl font-bold mb-2">Line Chart</h2>
                <canvas ref="lineChartRef"></canvas>
            </div>

            <!-- Bar Chart -->
            <div class="mb-6">
                <h2 class="text-xl font-bold mb-2">Bar Chart</h2>
                <canvas ref="barChartRef"></canvas>
            </div>
        </div>
    </div>
</template>
