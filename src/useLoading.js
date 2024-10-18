// src/useLoading.js
import { ref } from 'vue';

const loading = ref(false);

async function simulateAxiosProcess(promise) {
    try {
        loading.value = true;
        const result = await promise;
        return result;
    } catch (error) {
        throw error;
    } finally {
        loading.value = false;
    }
}

export { loading, simulateAxiosProcess };
