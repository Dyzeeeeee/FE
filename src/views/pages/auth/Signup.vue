<script setup>
import AppConfigurator from '@/layout/AppConfigurator.vue';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form fields
const firstname = ref('');
const lastname = ref('');
const birthday = ref('');
const address = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');

// Sign-up logic using Axios
const signUp = async () => {
    // Perform basic validation
    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await axios.post('/signup', {
            firstname: firstname.value,
            lastname: lastname.value,
            birthday: birthday.value,
            email: email.value,
            phone: phone.value,
            password: password.value,
            address: address.value,
        });

        // Handle successful response (you can redirect or show a message)
        console.log(response.data);

        alert('Registration successful!');
        router.push('/auth/login'); // Redirect to login page after sign up

    } catch (error) {
        // Handle error
        if (error.response && error.response.data) {
            alert(`Error: ${error.response.data.message}`);
        } else {
            alert('An error occurred during registration.');
        }
        console.error(error);
    }
};

const handleWelcome = () => {
    router.push('/auth/welcome');
};
</script>

<template>
    <AppConfigurator />
    <div class="grid grid-cols-12 h-screen bg-slate-800">
        <div class="hidden xl:block xl:col-span-7"></div>

        <div
            class="col-span-12 xl:col-span-5 bg-black p-5 flex flex-col justify-between xl:p-10 xl:rounded-3xl xl:m-20 bg-slate-900">
            <div>
                <div></div>
                <div class="relative h-1/3 xl:h-0" style="margin: -20px;">
                    <img src="@/assets/pics/Beach.png" alt="" class="h-auto w-screen mb-7 xl:hidden " />
                    <div class="absolute top-0 left-0 p-2">
                        <Button rounded class="h-[45px] w-[60px]" style="outline: 2px solid black;"
                            @click="handleWelcome">
                            <Icon icon="ep:back" height="25" width="25" />
                        </Button>
                    </div>
                </div>

                <div class="text-center font-bold text-4xl mt-9">Register</div>
                <div class="text-center text-base px-4">Create your account</div>
                <div class="text-base mt-8 font-bold flex-col flex gap-4">
                    <div class="flex gap-2">
                        <InputText placeholder="Firstname" class="w-1/2" v-model="firstname" />
                        <InputText placeholder="Lastname" class="w-1/2" v-model="lastname" />
                    </div>
                    <div class="flex gap-2">
                        <InputText placeholder="Phone" class="w-full" v-model="phone" />
                    </div>
                    <div class="flex gap-2">
                        <InputText placeholder="Email" class="w-full" v-model="email" />
                    </div>
                    <div class="flex ">
                        <Password placeholder="Password" toggleMask :feedback="false" style="width: 100%;"
                            input-style="width: 100%;" v-model="password" />
                    </div>
                    <div class="flex ">
                        <Password placeholder="Confirm Password" toggleMask :feedback="false" style="width: 100%;"
                            input-style="width: 100%;" v-model="confirmPassword" />
                    </div>
                </div>
                <div class="flex px-2 mt-2 text-sm py-2">
                    <div class="flex">
                        <div class="self-center ml-2">
                            By signing up, it means that you agree with our
                            <router-link class="font-bold">Terms and Conditions</router-link>. Okay guys nice try
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <!-- Bottom content container -->
                <div class="flex mt-2 font-bold">
                    <Button rounded class="w-full mb-4" @click="signUp">
                        <div class="p-2">Sign up</div>
                    </Button>
                </div>
                <div class="flex text-sm justify-center">
                    <div>Already have an account?</div>
                    <div class="underline font-bold">
                        <router-link to="/auth/login">&nbsp;Login&nbsp;</router-link>
                    </div>
                </div>
                <!-- <div class="hidden xl:block">
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
                </div> -->
            </div>
        </div>
    </div>
</template>
