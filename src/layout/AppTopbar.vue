<script setup>
import { useLayout } from '@/layout/composables/layout';
import router from '@/router';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import AppConfigurator from './AppConfigurator.vue';

const installPromptEvent = ref(null);
const isInstallable = ref(false);
const route = useRoute();
const showComponent = computed(() => {
    return route.path !== '/customer' && route.path !== '/customer/menu' && route.path !== '/customer/rooms';
});
const advertisment = ref(true)
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Save the event for later use
    installPromptEvent.value = e;
    // Update installable status
    isInstallable.value = true;
});

const handleInstallApp = async () => {
    if (installPromptEvent.value) {
        // Show the install prompt
        installPromptEvent.value.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await installPromptEvent.value.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        // We no longer need the prompt. Clear it up.
        installPromptEvent.value = null;
        isInstallable.value = false;
    }
};

const menuStates = ref({
    calendarMenu: false,
    profileMenu: false,
    notifMenu: false,
    appMenu: false
});


const handleMenuClick = (menuKey) => {
    // Iterate over all keys in the menuStates object
    for (const key in menuStates.value) {
        // Set the menu with the matching key to true and all others to false
        menuStates.value[key] = key === menuKey ? !menuStates.value[key] : false;
    }
};

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


const items = ref([
    {
        separator: true
    },
    {
        label: 'Documents',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                shortcut: '⌘+N'
            },
            {
                label: 'Search',
                icon: 'pi pi-search',
                shortcut: '⌘+S'
            }
        ]
    },
    {
        label: 'Profile',
        items: [
            {
                label: 'Settings',
                icon: 'pi pi-cog',
                shortcut: '⌘+O'
            },
            {
                label: 'Messages',
                icon: 'pi pi-inbox',
                badge: 2
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                shortcut: '⌘+Q'
            }
        ]
    },
    {
        separator: true
    }
]);

const userData = ref([]);

// Fetch user data by ID from session storage
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

// Fetch user data on component mount
onMounted(() => {
    getUserById();
});
</script>

<template>
    <Dialog v-model:visible="advertisment" modal v-if="showComponent && isInstallable"
        :style="{ width: '80vw', height: 'auto' }" :pt="{
            root: 'border-none',
            mask: {
                style: 'backdrop-filter: blur(10px)',
            },
        }">
        <div class="flex justify-center text-2xl font-bold mb-2">
            <img src="@/assets/pics/AppLogo.png" class="self-center" alt="" style="height: 50px; min-width: 50px;">
        </div>
        <div class="text-center justify-center text-2xl font-bold mb-2">
            You can now install the
            <span class="text-yellow-400
                font-bold">&nbsp;Anahaw Island View Resort Application</span>&nbsp;in your
            device
        </div>
        <div class="w-full">
            <Button @click="handleInstallApp" class="w-full">Install Now</Button>
        </div>
    </Dialog>
    <div class="layout-topbar fixed top-0 left-0 w-full z-40">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" style="width: 50%;">
                <img src="@/assets/pics/logo.png" alt="Company Logo">
            </router-link>
        </div>

        <div class="layout-topbar-actions relative">
            <div class="layout-config-menu">
                <AppConfigurator />
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <div>
                        <button type="button" class="layout-topbar-action" @click="handleMenuClick('appMenu')">
                            <Icon icon="fluent:apps-28-filled" height="25"
                                :class="{ 'text-yellow-500': menuStates.appMenu, 'text-white': !menuStates.appMenu }" />

                        </button>
                        <div v-show="menuStates.appMenu"
                            class="absolute right-0 mt-2  rounded shadow-lg w-[30rem] h-[30rem] p-0 z-50 card bg-surface-900 pb-4">
                            <div class="text-xl font-bold p-3">
                                Apps
                            </div>
                        </div>
                    </div>
                    <div>

                        <button type="button" class="layout-topbar-action" @click="handleMenuClick('calendarMenu')">
                            <Icon icon="ph:calendar-fill" height="25"
                                :class="{ 'text-yellow-500': menuStates.calendarMenu, 'text-white': !menuStates.calendarMenu }" />
                        </button>
                        <div v-show="menuStates.calendarMenu"
                            class="absolute right-0 mt-2  rounded shadow-lg w-[30rem] h-[30rem] p-0 z-50 card bg-surface-900 pb-4">
                            <div class="text-xl font-bold p-3">
                                Calendar
                            </div>
                        </div>
                    </div>
                    <div>
                        <button type="button" class="layout-topbar-action" @click="handleMenuClick('notifMenu')">
                            <Icon icon="ic:sharp-notifications" height="25"
                                :class="{ 'text-yellow-500': menuStates.notifMenu, 'text-white': !menuStates.notifMenu }" />
                        </button>
                        <div v-show="menuStates.notifMenu"
                            class="absolute right-0 mt-2  rounded shadow-lg w-[30rem] h-[30rem] p-0 z-50 card bg-surface-900 pb-4">
                            <div class="text-xl font-bold p-3">
                                Notifications
                            </div>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="cursor-pointer" @click="handleMenuClick('profileMenu')">
                            <img src="https://res.cloudinary.com/teepublic/image/private/s--70s5l004--/c_crop,x_10,y_10/c_fit,w_1109/c_crop,g_north_west,h_1008,w_1260,x_-76,y_-64/co_rgb:c8e0ec,e_colorize,u_Misc:One%20Pixel%20Gray/c_scale,g_north_west,h_1008,w_1260/fl_layer_apply,g_north_west,x_-76,y_-64/bo_157px_solid_white/e_overlay,fl_layer_apply,h_1008,l_Misc:Art%20Print%20Bumpmap,w_1260/e_shadow,x_6,y_6/c_limit,h_1254,w_1254/c_lpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1661243507/production/designs/34363529_0.jpg"
                                alt="Profile Avatar" class="w-10 h-10 rounded-full mr-2 border-2  p-0.5"
                                :class="{ 'border-yellow-500': menuStates.profileMenu, 'border-white': !menuStates.profileMenu }" />

                        </div>
                        <div v-show="menuStates.profileMenu"
                            class="absolute right-0 mt-2  rounded shadow-lg w-[20rem] p-0 z-50 card bg-surface-900 pb-4 "
                            @click.away="profileMenu = false">
                            <div class="p-2 cursor-pointer flex hover:bg-surface-800 px-3 py-4 m-2 rounded-lg "
                                @click="router.push('/staff/profile')">
                                <img src="https://res.cloudinary.com/teepublic/image/private/s--70s5l004--/c_crop,x_10,y_10/c_fit,w_1109/c_crop,g_north_west,h_1008,w_1260,x_-76,y_-64/co_rgb:c8e0ec,e_colorize,u_Misc:One%20Pixel%20Gray/c_scale,g_north_west,h_1008,w_1260/fl_layer_apply,g_north_west,x_-76,y_-64/bo_157px_solid_white/e_overlay,fl_layer_apply,h_1008,l_Misc:Art%20Print%20Bumpmap,w_1260/e_shadow,x_6,y_6/c_limit,h_1254,w_1254/c_lpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1661243507/production/designs/34363529_0.jpg"
                                    alt="Profile Avatar"
                                    class="w-10 h-10 rounded-full mr-2 border-2 border-green-500 p-0.5" />

                                <div class="flex-wrap">
                                    <div class="font-bold">
                                        {{ userData.firstname }} {{ userData.lastname }}</div>
                                    <div class="italic">
                                        {{ userData.role }}
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <div class="p-2 cursor-pointer flex hover:bg-surface-800 gap-2 px-3 py-4 m-2  rounded-lg"
                                @click="router.push('/staff/settings')">
                                <Icon icon="ion:settings-sharp" height="20" />
                                <div class="flex-wrap">
                                    Settings
                                </div>
                            </div>
                            <div class="p-2 px-4 ">
                                <Button class="p-2 cursor-pointer flex gap-2 w-full" outlined @click="handleLogout"
                                    severity="warn">
                                    <Icon icon="solar:logout-3-bold" height="20" />
                                    <div class="flex-wrap">
                                        Logout
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.profile-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    border: 2px solid #4caf50;
    padding: 2px;
}
</style>