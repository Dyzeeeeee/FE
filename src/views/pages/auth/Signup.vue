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
                <div>

                </div>
                <div class="relative h-1/3" style="margin: -20px;">
                    <img src=" @/assets/pics/shore.png" alt="" class="h-auto w-screen mb-7">
                    <div class="absolute top-0 left-0 p-2">
                        <Button rounded class="h-[45px] w-[60px]" style="outline: 2px solid black;"
                            @click="handleWelcome">
                            <Icon icon="ep:back" height="25" width="25" />
                        </Button>
                    </div>
                </div>

                <div class="text-center font-bold text-4xl mt-9">
                    Register
                </div>
                <div class="text-center text-base px-4">
                    Create your account
                </div>
                <div class="text-base mt-8 font-bold flex-col flex gap-4">
                    <div class="flex gap-2">
                        <InputText placeholder="Firstname" class="w-1/2" />
                        <InputText placeholder="Lastname" class="w-1/2" />
                    </div>
                    <div class="flex gap-2">
                        <InputText placeholder="Email or phone" class="w-full" />
                    </div>
                    <div class="flex ">
                        <Password placeholder="Password" toggleMask :feedback="false" style="width: 100%;"
                            input-style="width: 100%;" />
                    </div>
                    <div class="flex ">
                        <Password placeholder="Confirm Password" toggleMask :feedback="false" style="width: 100%;"
                            input-style="width: 100%;" />
                    </div>
                </div>
                <div class="flex px-2 mt-2 text-sm">
                    <div class="flex">
                        <div class="self-center ml-2">By signing up, it means that you agree with our <router-link
                                class="font-bold">Terms
                                and Conditions</router-link>. Okay guys nice try</div>
                    </div>
                </div>
            </div>

            <div> <!-- Bottom content container -->
                <div class="flex mt-2 font-bold">
                    <Button rounded class="w-full mb-4" @click="handleLogin">
                        <div class="p-2">Sign up</div>
                    </Button>
                </div>
                <div class="flex text-sm justify-center">
                    <div>Already have an account?</div>
                    <div class="underline font-bold"><router-link to="/signup">&nbsp;Login&nbsp;</router-link></div>
                </div>
            </div>

            <div class="h-[0rem]"></div>
        </div>
    </div>
</template>
