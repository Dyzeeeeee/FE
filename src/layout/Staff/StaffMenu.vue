<script setup>
import { ref } from 'vue';
import StaffMenuItem from './StaffMenuItem.vue';

const model = ref([
    {
        items: [
            {
                label: 'Username', // Consider changing 'label' to the actual user's name if dynamic
                role: 'Staff', // User's role
                avatar: 'https://thumbs.dreamstime.com/b/vector-illustration-smiling-shark-cartoon-minimalist-flat-style-isolated-white-background-315602043.jpg',
                to: '/staff/profile'
            }
        ]
    },
    {
        items: [
            { label: 'Home', icon: 'mdi:home', to: '/staff' },
            // { label: 'Sales', icon: 'mdi:currency-usd-circle', to: '/staff/sales' },
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
