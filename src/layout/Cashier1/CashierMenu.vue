<script setup>
import { ref } from 'vue';
import CashierMenuItem from './CashierMenuItem.vue';

const model = ref([
    {
        items: [
            {
                label: 'Username', // Consider changing 'label' to the actual user's name if dynamic
                role: 'Cashier', // User's role
                avatar: 'https://thumbs.dreamstime.com/b/vector-illustration-smiling-shark-cartoon-minimalist-flat-style-isolated-white-background-315602043.jpg',
                to: '/cashier/profile'
            }
        ]
    },
    {
        label: 'Cashier',
        items: [
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/cashier' },
            { label: 'Sales', icon: 'pi pi-fw pi-list-check', to: '/cashier/Sales' },
            { label: 'POS', icon: 'pi pi-fw pi-money-bill', to: '/cashier/POS' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <cashier-menu-item v-if="!item.separator" :item="item" :index="i"></cashier-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
