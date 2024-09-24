<script setup>
import { ref } from 'vue';
const installPromptEvent = ref(null);
const isInstallable = ref(false);

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
    <!-- <Floater /> -->

    <div class="flex w-full  p-2 justify-between" v-if="isInstallable">
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
    <router-view />
</template>

<style>
/* Customize the width and height of the scrollbar */
::-webkit-scrollbar {
    width: 7px;
    /* Thinner scrollbar width */
    height: 7px;
    /* Thinner scrollbar height */
}

/* Customize the background of the scrollbar track */
::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    /* Subtle track background */
}

/* Customize the appearance of the scrollbar thumb (the draggable part) */
::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    /* Scrollbar handle color */
    border-radius: 10px;
    /* Rounded corners for the scrollbar handle */
    border: 1px solid transparent;
    /* Optional: Adds a border around the scrollbar handle */
}
</style>
