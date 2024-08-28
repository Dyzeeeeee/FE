<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import AppTopbar from './../AppTopbar.vue';
import StaffSidebar from './StaffSidebar.vue';

const currentTime = ref(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
const currentDate = ref(formatDate(new Date()));

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short', // "Wed"
        month: 'long',
        day: 'numeric' // "7"
        // "August"
    });
}

const updateTimeAndDate = () => {
    currentTime.value = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    currentDate.value = formatDate(new Date());
};

let timeInterval;
onMounted(() => {
    timeInterval = setInterval(updateTimeAndDate, 60000); // Update every minute
});

onUnmounted(() => {
    clearInterval(timeInterval);
});
const { layoutConfig, layoutState, isSidebarActive, resetMenu } = useLayout();

const outsideClickListener = ref(null);

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive
    };
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                resetMenu();
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar></app-topbar>
        <staff-sidebar ></staff-sidebar>
        <div class="layout-main-container ">
            <div class="layout-main">
                <router-view></router-view>
            </div>
            <!-- <app-footer></app-footer> -->
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <div class="flex fixed bottom-0 right-0 m-2 text-center rounded-t-lg">
        <div class="flex-1 font-bold p-1 rounded-tl-lg -mb-2 pt-2 px-2 bg-blue-400 text-black" style="text-transform: lowercase">
            {{ currentTime }}
        </div>
        <div class="-mb-2 pt-2 px-2 font-bold rounded-tr-lg bg-green-100 text-black">
            {{ currentDate }}
        </div>
    </div>
    <Toast />
</template>
