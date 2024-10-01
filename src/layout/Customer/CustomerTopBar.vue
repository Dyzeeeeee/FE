<template>
    <div v-if="showComponent"
        :class="['fixed top-0 left-0 right-0 z-50', isRounded ? 'mt-5 rounded-3xl mx-5 bg-emerald-800 p-2 shadow-md transition-all duration-300 ease-in-out' : ' bg-gray-800  p-2 transition-all duration-300 ease-in-out']">
        <div class="flex justify-between px-2 self-center">
            <div class="flex gap-2 flex-1">
                <div class=" flex-wrap  ">
                    <div class="text-white">
                        <img src="@/assets/pics/logo-plain.png" alt="" style="height: 2rem;">
                    </div>
                    <div class="text-xs font-bold">Anahaw</div>
                </div>
                <div class="self-center">
                    <!-- <Icon icon="lets-icons:search-fill" height="25" width="25" /> -->
                </div>
            </div>
            <div v-if="userId" class="flex gap-2 justify-center text-center flex-1 text-white">
                <div class="self-center font-bold text-lg">
                    {{ routeName }}
                </div>
            </div>

            <div v-if="userId" class="self-center flex gap-3 flex-1 justify-end">
                <Icon icon="ic:sharp-notifications" height="25" width="25" />
                <Icon icon="pajamas:profile" height="25" width="25" />
            </div>
            <Button v-else class="self-center flex w-[50%] font-bold py-2 px-4" @click="goToLogin">
                Log in
            </Button>
        </div>
    </div>

</template>


<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const userId = computed(() => sessionStorage.getItem('userId'));

const route = useRoute();
const router = useRouter();

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
    if (route.path === '/customer') {
        return 'HOME';
    } else if (route.path === '/customer/menu') {
        return 'MENU';
    } else if (route.path === '/customer/rooms') {
        return 'ROOMS';
    } else if (route.path === '/customer/more') {
        return 'MORE';
    }

    return '';
});

const showComponent = computed(() => {
    return route.path !== '/customer/more';
});
</script>