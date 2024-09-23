<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import StaffMenuItem from './StaffMenuItem.vue';
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

onMounted(() => {
    getUserById();

});

const model = computed(() => [
    {
        items: [
            {
                label: userData.value ? `${userData.value.firstname || ''} ${userData.value.lastname || ''}`.trim() : 'Guest',
                role: `${userData.value.role}`,
                avatar: 'https://thumbs.dreamstime.com/b/vector-illustration-smiling-shark-cartoon-minimalist-flat-style-isolated-white-background-315602043.jpg',
                to: '/staff/profile'
            }
        ]
    },
    // Remainder of your menu items
    {
        items: [
            { label: 'Home', icon: 'mdi:home', to: '/staff' },
            { label: 'POS', icon: 'mdi:cash-register', to: '/staff/pos' },
            { label: 'Tasks', icon: 'mdi:clipboard-text', to: '/staff/tasks' },
            { label: 'Reservations', icon: 'fluent-mdl2:reservation-orders', to: '/staff/reservations' },
            { label: 'Kitchen', icon: 'hugeicons:chef', to: '/staff/kitchen' },
            { label: 'Customers', icon: 'gravity-ui:persons', to: '/staff/customers' },
            { label: 'Inventory', icon: 'ic:baseline-inventory', to: '/staff/inventory' },
        ]
    }
]);


</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <staff-menu-item v-if="!item.separator" :item="item" :index="i"></staff-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
