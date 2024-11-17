<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Navigation function to route to the clicked path
function goTo(path) {
    router.push(path);
}

const router = useRouter();
const route = useRoute(); // Reactive current route object

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

// Menu model for the staff dashboard
const model = computed(() => [
    { label: 'Home', icon: 'mdi:home', to: '/staff/home', color: 'text-yellow-500' },
    { label: 'POS', icon: 'mdi:cash-register', to: '/staff/pos', color: 'text-blue-500' },
    { label: 'Tasks', icon: 'mdi:clipboard-text', to: '/staff/tasks', color: 'text-green-500' },
    { label: 'Reservations', icon: 'fluent-mdl2:reservation-orders', to: '/staff/reservations', color: 'text-red-500' },
    { label: 'Kitchen', icon: 'hugeicons:chef', to: '/staff/kitchen', color: 'text-orange-500' },
    { label: 'Customers', icon: 'gravity-ui:persons', to: '/staff/customers', color: 'text-white' },
    { label: 'Inventory', icon: 'ic:baseline-inventory', to: '/staff/inventory', color: 'text-indigo-500' },
    { label: 'Settings', icon: 'basil:settings-alt-outline', to: '/staff/settings', color: 'text-gray-500' },
]);

// Function to check if the current route matches or is a sub-route of the item path
const isRouteActive = (itemPath) => {
    return route.path.startsWith(itemPath); // Checks if the current path starts with the item's path
};
</script>

<template>
    <div class="grid grid-cols-12 gap-2">
        <!-- Profile Card -->
        <div class="col-span-12 mb-3">
            <div class="card bg-surface-800 p-4 cursor-pointer"
                :class="{ 'active-card': isRouteActive('/staff/profile') }" @click="goTo('/staff/profile')">
                <div class="flex">
                    <div>
                        <img src="https://res.cloudinary.com/teepublic/image/private/s--70s5l004--/c_crop,x_10,y_10/c_fit,w_1109/c_crop,g_north_west,h_1008,w_1260,x_-76,y_-64/co_rgb:c8e0ec,e_colorize,u_Misc:One%20Pixel%20Gray/c_scale,g_north_west,h_1008,w_1260/fl_layer_apply,g_north_west,x_-76,y_-64/bo_157px_solid_white/e_overlay,fl_layer_apply,h_1008,l_Misc:Art%20Print%20Bumpmap,w_1260/e_shadow,x_6,y_6/c_limit,h_1254,w_1254/c_lpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1661243507/production/designs/34363529_0.jpg"
                            alt="Profile Avatar" class="profile-avatar" />
                    </div>
                    <div>
                        <div class="font-bold text-xl">
                            {{ userData.firstname }} {{ userData.lastname }}
                        </div>
                        <div class="italic ">{{ userData.role }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Other Menu Items -->
        <div class="col-span-6" v-for="item in model" :key="item.label">
            <div class="card bg-surface-800 p-7 font-bold cursor-pointer"
                :class="{ 'active-card': isRouteActive(item.to) }" @click="goTo(item.to)">
                <div :class="[item.color, 'mb-2']">
                    <Icon :icon="item.icon" height="20" />
                </div>
                <div>{{ item.label }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 8px;
    overflow: hidden;
    /* Keeps all content inside the border-radius */
}

/* .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
} */

.active-card {
    border: 2px solid #ffcc44;
    /* Highlight active card */
    background-color: #203444;
    /* Background for active card */
}

.icon-size {
    font-size: 24px;
    /* Adjust icon size as needed */
}

.profile-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    border: 2px solid #4caf50;
    padding: 2px;
}
</style>
