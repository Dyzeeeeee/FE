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
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/staff' },
            { label: 'Sales', icon: 'pi pi-fw pi-list-check', to: '/staff/Sales' },
            { label: 'POS', icon: 'pi pi-fw pi-money-bill', to: '/staff/POS' }
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
