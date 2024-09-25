<template>

    <AppConfigurator />
    <div class="grid grid-cols-12 h-screen bg-slate-800">
        <div class="hidden xl:block xl:col-span-7  flex justify-center items-center self-center">
            <div class="flex justify-center">
                <img src="@/assets/pics/download.gif" alt="Centered GIF" class="max-w-full max-h-full" />
            </div>
        </div>

        <div
            class="col-span-12 xl:col-span-5 bg-black p-5 flex flex-col justify-between xl:p-10 xl:rounded-3xl xl:m-20 bg-slate-900">
            <!-- Top content container -->
            <div class="flex-grow">
                <div class="relative h-1/2 xl:h-0" style="margin: -20px;">
                    <img src="@/assets/pics/login.png" alt="Login Welcome" class="h-full w-screen mb-7 xl:hidden"
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
                        <InputText placeholder="Email" v-model="email" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-lock"></i>
                        </InputGroupAddon>
                        <Password v-model="password" inputId="password" placeholder="Password" toggleMask
                            :feedback="false" />
                    </InputGroup>
                </div>
                <div class="flex justify-between mt-2 text-sm">
                    <div class="flex">
                        <Checkbox v-model="rememberMe" :binary="true" />
                        <div class="self-center ml-2">Remember me</div>
                    </div>
                    <div>
                        Forgot Password?
                    </div>
                </div>
            </div>

            <!-- Bottom content container -->
            <div class="mt-auto">
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
                <div class="hidden xl:block">
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
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import AppConfigurator from '@/layout/AppConfigurator.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);

function handleWelcome() {
    router.push('/auth/welcome');
}

async function handleLogin() {
    try {
        const response = await axios.post('/login', {
            email: email.value,
            password: password.value
        });

        if (rememberMe.value == true) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.user.role); // Storing role for later use
            localStorage.setItem('userId', response.data.user.id); // Storing role for later use

        }
        // Store the token in localStorage or sessionStorage based on "remember me"
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('role', response.data.user.role); // Storing role for later use
        sessionStorage.setItem('userId', response.data.user.id); // Storing role for later use

        // Optionally set the Authorization header globally for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // Conditional routing based on the role
        if (response.data.user.role === 'customer') {
            router.push('/customer'); // Navigate to customer dashboard
        } else if (response.data.user.role === 'staff') {
            router.push('/staff'); // Navigate to staff dashboard
        } else {
            throw new Error('Unknown role');
        }

        alert('Login successful!');
    } catch (error) {
        alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
}

onMounted(() => {
    console.log("hostname is: ", window.location.hostname);
});

</script>

<style scoped>
/* Add your styles here if needed */
</style>
