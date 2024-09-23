<script setup>
import { useLayout } from '@/layout/composables/layout';
import router from '@/router';
import axios from 'axios';
import AppConfigurator from './AppConfigurator.vue';
const handleLogout = async () => {
    try {
        // Call backend logout endpoint
        await axios.post('/logout', {}, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        });

        // Clear local storage or any state management holding user data
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('userId');

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');

        // Redirect to the login page
        router.push('/auth/welcome').then(() => {
            // Reload the page to ensure proper rerouting after logout
            window.location.reload();
        });
    } catch (error) {
        console.error('Logout failed:', error);
    }
};


const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" style="width: 50%;">
                <img src="@/assets/pics/logo.png" alt="">

                <!-- <span>SAKAI</span> -->
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <button type="button" class="layout-topbar-action" @click="handleLogout">
                <i class="pi pi-power-off"></i>
                <span>Logout</span>
            </button>
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button" class="layout-topbar-action layout-topbar-action-highlight">
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
