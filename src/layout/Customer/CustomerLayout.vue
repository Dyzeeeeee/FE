<script setup>
import AppTopbar from '../AppTopbar.vue';
import CustomerBottomBar from './CustomerBottomBar.vue';

</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <div class="hidden">
            <app-topbar></app-topbar>
        </div>
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
</template>
