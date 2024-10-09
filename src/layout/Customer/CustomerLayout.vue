<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppTopbar from '../AppTopbar.vue';
import CustomerBottomBar from './CustomerBottomBar.vue';
import CustomerTopBar from './CustomerTopBar.vue';

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

</script>

<template>
    <template v-if="isInstallable">
        <div v-if="showComponent" class="flex w-full  p-2 justify-between">
            <div class="self-center ">
                <img src="@/assets/pics/AppLogo.png" class="self-center" alt="" style="height: 30px; min-width: 30px;">
            </div>
            <div class="self-center text-center hidden xl:block">
                You can now install the &nbsp;<span class="text-yellow-400 font-bold">Anahaw Island View Resort
                    App</span>
            </div>
            <div class="self-center text-center xl:hidden block">
                You can now install the &nbsp;<br><span class="text-yellow-400 font-bold">Anahaw Island View Resort
                    App</span>
            </div>
            <div class="flex">
                <div class="self-center ">
                    <Button @click="handleInstallApp" style="height: 30px">Install</Button>
                </div>
                <div class="self-center ml-4 cursor-pointer">
                    <Icon icon="ri:close-fill" height="20" @click="isInstallable = false" />
                </div>
            </div>
        </div>

    </template>
    <div class="layout-wrapper" :class="containerClass">
        <div class="hidden">
            <app-topbar></app-topbar>
        </div>
        <CustomerTopBar />

        <!-- bottom-bar that has 5 menu that is by default home then when an different button is selected it will be the
        active one -->
        <div class="layout-main-container -mt-12 ">
            <div class="layout-main -m-7 -mt-11">
                <router-view></router-view>
            </div>
            <div class="block xl:hidden">

                <CustomerBottomBar></CustomerBottomBar>
            </div>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <!-- <div class="flex fixed bottom-0 right-0 m-2 text-center rounded-t-lg">
        <div class="flex-1 font-bold p-1 rounded-tl-lg -mb-2 pt-2 px-2 bg-blue-400 text-black"
            style="text-transform: lowercase">
            {{ currentTime }}
        </div>
        <div class="-mb-2 pt-2 px-2 font-bold rounded-tr-lg bg-green-100 text-black">
            {{ currentDate }}
        </div>
    </div> -->
    <Toast />

    <Dialog v-model:visible="advertisment" modal v-if="!showComponent && isInstallable"
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
</template>


<style scoped></style>