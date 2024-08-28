<script setup>
import bgImage from '@/assets/pics/bg.jfif';
import AppConfigurator from '@/layout/AppConfigurator.vue';
</script>

<template>
    <AppConfigurator />
    <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"></div>

    <div class="grid grid-cols-12 h-screen" style="background-image: url('https://www.bucuti.com/storage/app/uploads/public/5e3/c39/769/thumb_82_1920_1080_0_0_crop.jpg'); background-size: cover; background-position: center">
        <div class="col-span-12 xl:col-span-7 xl:justify-content-end justify-content-center flex h-full align-items-center relative z-10">
            <div class="card mb-0 w-11 xl:w-9 xl:h-3/4 p-3 xl:p-8" style="border-radius: 0">
                <div class="flex justify-content-center">
                    <!-- <img src="@/assets/pics/logo.png" alt="" style="height: 4rem" /> -->
                </div>
                <div class="flex justify-content-center mt-5">
                    <div class="text-4xl font-bold">Log in to your account</div>
                </div>
                <div class="flex-wrap flex mt-5 w-12 justify-content-center">
                    <div class="flex w-12">
                        <InputText id="username" v-model="value" class="w-full" placeholder="Email or phone" />
                    </div>
                    <div class="flex w-12 mt-3">
                        <InputText id="username" v-model="value" class="w-full" placeholder="Password" />
                    </div>
                </div>
                <div class="flex align-items-center justify-content-between mb-5 gap-5 mt-2">
                    <div class="flex align-items-center">
                        <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                        <label for="rememberme1">Remember me</label>
                    </div>
                    <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                </div>
                <div class="flex">
                    <Button class="w-full font-bold text-xl"> Log in </Button>
                </div>
                <Divider align="center" type="dotted">
                    <b>OR</b>
                </Divider>
                <div class="justify-content-center flex mb-3">
                    <Button label="Log in with Facebook" outlined class="w-full p-3 text-xl" icon="pi pi-facebook" severity="info" iconPos="left" />
                </div>
                <div class="justify-content-center flex w-full mb-3">
                    <Button label="Log in with Google" outlined class="w-full p-3 text-xl" icon="pi pi-google" severity="danger" iconPos="left" />
                </div>
                <div class="flex justify-content-center">
                    <div class="text-lg">
                        <span> Don't have an account yet? <Button link class="text-primary p-0 pl-2 text-lg font-bold"> Sign up</Button></span>
                    </div>
                </div>
            </div>
        </div>
        <!-- This will be hidden on screens smaller than xl -->
        <div class="hidden xl:flex xl:col-span-5 justify-content-start h-full items-center relative z-10">
            <div class="card mb-0 w-9 xl:h-3/4 h-1/2 p-8 text-black flex flex-col justify-between" :style="{ borderRadius: '0', backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
                <div class="justify-content-center flex text-3xl font-bold mb-3">Welcome to</div>
                <div class="flex justify-content-center">
                    <img src="@/assets/pics/logo.png" alt="" style="height: 10rem" />
                </div>
                <div class="flex justify-content-center text-center mt-6 px-7">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum corrupti cum id debitis ad fuga incidunt non aliquam, quo cumque possimus. Adipisci porro aut pariatur. Veritatis nobis mollitia iure fugit.
                </div>
                <div class="flex justify-content-center text-center mt-auto px-7">0992 410 3295 | jdmalaluan2@gmail.com</div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
