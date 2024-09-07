<template>
    <div>
        <h1>Data from Backend:</h1>
        <ul v-if="data.length > 0">
            <li v-for="item in data" :key="item.id">{{ item.title }}</li>
        </ul>
        <Button @click="fetchData">Fetch Data</Button>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const data = ref([]);

const fetchData = () => {
    axios.get('http://be.test/try')  // Make sure the endpoint matches the API's URL
        .then(response => {
            data.value = response.data;
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
};

// Fetch data when the component is mounted
onMounted(fetchData);
</script>
