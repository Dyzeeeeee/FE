<script setup>
import AppConfigurator from '@/layout/AppConfigurator.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function handleWelcome() {
    router.push('/auth/welcome');
}
</script>

<template>
    <AppConfigurator />
    <div class="grid grid-cols-12 h-screen">
        <div class="col-span-12 bg-black p-5 flex flex-col justify-between"> <!-- Updated here -->
            <div>
                <div class="relative h-1/2" style="margin: -20px;">
                    <img src="@/assets/pics/LoginWelcome.avif" alt="" class="h-full w-screen mb-7"
                        style="border-bottom-left-radius:160px; border-bottom-right-radius:160px;">

                    <div class="absolute top-0 left-0 p-4">
                        <Button rounded class="h-[45px] w-[60px]" style="outline: 2px solid black;"
                            @click="handleWelcome">
                            <Icon icon="ep:back" height="25" width="25" />
                        </Button>
                    </div>
                </div>
                <div class="text-center font-bold text-4xl mt-9">
                    Welcome Back!
                </div>
                <div class="text-center text-base px-4">
                    Log in to your account
                </div>
                <div class="text-base mt-8 font-bold flex-col flex gap-5">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-user"></i>
                        </InputGroupAddon>
                        <InputText placeholder="Username" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-lock"></i>
                        </InputGroupAddon>
                        <Password v-model="value" inputId="password" placeholder="Password" toggleMask
                            :feedback="false" />
                    </InputGroup>
                </div>
                <div class="flex justify-between mt-2 text-sm">
                    <div class="flex">
                        <Checkbox />
                        <div class="self-center ml-2">Remember me</div>
                    </div>
                    <div>
                        Forgot Password?
                    </div>
                </div>
            </div>

            <div> <!-- Bottom content container -->
                <div class="flex mt-2 font-bold">
                    <Button rounded class="w-full mb-4" @click="handleLogin">
                        <div class="p-2">Login</div>
                    </Button>
                </div>
                <div class="flex text-sm justify-center">
                    <div>Don't have an account yet?</div>
                    <div class="underline font-bold"><router-link to="/auth/signup">&nbsp;Sign up&nbsp;</router-link>
                    </div>
                </div>
            </div>

            <div class="h-[5rem]"></div>
        </div>
    </div>
</template>


<style scoped></style>
