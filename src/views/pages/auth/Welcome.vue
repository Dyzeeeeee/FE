<script setup>
import AppConfigurator from '@/layout/AppConfigurator.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function gotoLogin() {
    router.push('/auth/login');
}

function goToSignup() {
    router.push('/auth/signup');
}
</script>

<template>
    <AppConfigurator />
    <!-- <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm h-screen"></div> -->

    <!-- <div class="grid grid-cols-12 h-screen"
        style="background-image: url('https://www.bucuti.com/storage/app/uploads/public/5e3/c39/769/thumb_82_1920_1080_0_0_crop.jpg'); background-size: cover; background-position: center">
        <div class="col-span-12 self-center  flex justify-center relative z-10">
            <div class="card w-10/12">

            </div>
        </div>
    </div> -->

    <div class="grid grid-cols-12 h-screen">
        <div class="col-span-12  bg-black p-5">
            <div class="relative flex flex-col justify-center items-center h-1/3 p-0">
                <!-- Welcome Image as Background -->
                <img src="@/assets/pics/Welcome.png" alt="Welcome" class="h-auto w-screen mb-7 object-cover">

                <!-- Logo Image at the center with an outline -->
                <img src="@/assets/pics/logo-outline.png" alt="Logo" class="absolute h-[8rem] w-auto my-4 mt-7">
            </div>


            <div class="text-center font-bold text-5xl">
                Mabuhay!
            </div>
            <div class="text-center text-base px-4">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam maiores cumque natus impedit laboriosam,
                sapiente
            </div>
            <div class="text-center text-base mt-8 font-bold">
                <Button rounded class="w-full mb-4" @click="gotoLogin">
                    <div class="p-2">Login</div>
                </Button>
                <Button rounded outlined class="w-full" @click="goToSignup">
                    <div class="p-2">Sign Up</div>
                </Button>
            </div>
            <div class="text-center text-sm font-light px-4 mt-7">
                <Divider align="center">
                    <b>or</b>
                </Divider>
            </div>
            <div class="text-center text-sm font-light px-4 mt-7">
                <Button text>
                    <Icon icon="ri:facebook-fill" width="45" height="45" class="text-blue-500" />
                </Button>
                <Button text>
                    <Icon icon="ri:google-fill" width="45" height="45" class="text-red-500" />
                </Button>
                <Button text>
                    <Icon icon="hugeicons:new-twitter" width="45" height="45" class="text-white" />
                </Button>
            </div>
            <div class="text-center text-base mt-8 font-bold underline">
                <a href="/customer">Continue as guest</a>
            </div>
        </div>


    </div>

</template>

<style scoped></style>
