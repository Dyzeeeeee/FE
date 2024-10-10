<template>
    <div v-if="minimized === true"
        :class="['xl:hidden block top-0 left-0 bg-emerald-500 fixed p-3 mt-3 rounded-tr-xl rounded-br-xl z-50', isHidden ? 'opacity-0' : 'opacity-90 fixed ']"
        @click="toggleTopBar" @mouseenter="resetInactivityTimer" @mouseleave="resetInactivityTimer"
        :style="{ transition: 'opacity 1s ease' }">
        <div>
            <img src="@/assets/pics/logo-plain.png" alt="" style="height: 2rem;" />
        </div>
    </div>
    <div v-if="showComponent && minimized === false" class=" xl:hidden block "
        :class="[' top-0 left-0 right-0 z-50 ', isRounded ? 'text-surface-800 border-[2px] border-surface-800 mt-3 rounded-3xl mx-2 bg-emerald-500 p-2 shadow-md transition-all duration-300 ease-in-out' : ' fixed bg-gray-800  p-2 transition-all duration-300 ease-in-out']">
        <div class="flex justify-between px-2 self-center">
            <div class="flex gap-2 flex-1">
                <div class="self-center" @click="toggleTopBar">
                    <Icon icon="tabler:arrow-up-left-circle" height="25" width="25" />
                </div>

                <div class=" flex-wrap  ">
                    <div class="">
                        <img src="@/assets/pics/logo-plain.png" alt="" style="height: 2rem;">
                    </div>
                    <div class="text-xs font-bold">Anahaw</div>
                </div>
            </div>
            <div v-if="userId" class="flex gap-2 justify-center text-center flex-1">
                <div class="self-center font-bold text-lg">
                    {{ routeName }}
                </div>
            </div>

            <div v-if="userId" class="self-center flex gap-2 flex-1 justify-end ">
                <Icon icon="ic:sharp-notifications" class="w-9 h-9 rounded-full p-0.5 self-center" />
                <!-- <Icon icon="pajamas:profile" height="25" width="25" /> -->
                <img src="https://res.cloudinary.com/teepublic/image/private/s--70s5l004--/c_crop,x_10,y_10/c_fit,w_1109/c_crop,g_north_west,h_1008,w_1260,x_-76,y_-64/co_rgb:c8e0ec,e_colorize,u_Misc:One%20Pixel%20Gray/c_scale,g_north_west,h_1008,w_1260/fl_layer_apply,g_north_west,x_-76,y_-64/bo_157px_solid_white/e_overlay,fl_layer_apply,h_1008,l_Misc:Art%20Print%20Bumpmap,w_1260/e_shadow,x_6,y_6/c_limit,h_1254,w_1254/c_lpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1661243507/production/designs/34363529_0.jpg"
                    alt="Profile Avatar"
                    class="w-11 h-11 rounded-full mr-2 border-2 border-surface-800 bg-white p-0.5" />
            </div>
            <Button v-else class="self-center flex w-[50%] font-bold py-2 px-4" @click="goToLogin">
                Log in
            </Button>
        </div>
    </div>

</template>


<script setup>
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const userId = computed(() => sessionStorage.getItem('userId'));
const isHidden = ref(false); // Track whether the element should be hidden

let inactivityTimer;

const resetInactivityTimer = () => {
    isHidden.value = false; // Show the element on activity
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        isHidden.value = true; // Hide after 3 seconds of inactivity
    }, 3000);
};

const toggleTopBar = () => {
    minimized.value = !minimized.value;
    resetInactivityTimer(); // Reset the timer whenever the element is clicked
};

const route = useRoute();
const router = useRouter();
onMounted(() => {
    // Add event listeners to track user activity
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);

    // Start the inactivity timer when the component is mounted
    resetInactivityTimer();
});

onBeforeUnmount(() => {
    // Clean up event listeners when the component is destroyed
    window.removeEventListener('mousemove', resetInactivityTimer);
    window.removeEventListener('click', resetInactivityTimer);
    window.removeEventListener('keydown', resetInactivityTimer);
    window.removeEventListener('scroll', resetInactivityTimer);
    clearTimeout(inactivityTimer); // Clear the timer
});
const isRounded = ref(true); // State to manage if the topbar is rounded

const handleScroll = () => {
    // Change the shape based on the scroll position
    if (window.scrollY > 50) {
        isRounded.value = false;
    } else {
        isRounded.value = true;
    }
};
function goToLogin() {
    router.push('/auth/login');
}
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

const routeName = computed(() => {
    // Check the path to decide the text dynamically
    if (route.path === '/waiter/home') {
        return 'HOME';
    } else if (route.path === '/waiter/orders') {
        return 'ORDERS';
    }
    else if (route.path === '/waiter/menu') {
        return 'MENU';
    }
    else if (route.path === '/waiter/takeorder') {
        return 'TAKE ORDER';
    }

    return '';
});

const minimized = ref(true);



const showComponent = computed(() => {
    return route.path !== '/customer/more';
});
</script>