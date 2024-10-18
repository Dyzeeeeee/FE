<script setup>
import { useLayout } from '@/layout/composables/layout';
import router from '@/router';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
const { toggleDarkMode, isDarkTheme } = useLayout();
const userData = ref([]);
const installPromptEvent = ref(null);
import { simulateAxiosProcess } from '@/useLoading'; // Import the shared function


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
        is.value = false;
    }
};

const handleLogout = async () => {
    try {
        // Call backend logout endpoint
        await simulateAxiosProcess(axios.post('/logout', {}, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        }));

        // Clear local storage or any state management holding user data
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('userId');

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('orderId');

        // Redirect to the login page
        router.push('/auth/welcome').then(() => {
            // Reload the page to ensure proper rerouting after logout
            window.location.reload();
        });
    } catch (error) {
        console.error('Logout failed:', error);
    }
};
const getUserById = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.error('No user ID found in session storage');
        return;
    }

    try {
        const response = await axios.get(`/get-user/${userId}`);
        if (response.data) {
            userData.value = response.data;
            console.log('User data fetched:', userData.value);
        } else {
            console.error('No data returned for user');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

onMounted(() => {
    getUserById();

});

const visible = ref(false);

watch(visible, (newValue) => {
    if (newValue) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
});

</script>

<template>
    <div class="mb-[5rem] mt-[2rem]">

        <!-- <button v-if="isInstallable" @click="handleInstallApp">Install our app</button> -->
        <div class="flex text-xl font-bold pt-4 pb-5 pl-4">
            <!-- MORE -->
        </div>
        <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 lg:col-span-6 xl:col-span-8 ">
                <div class="card w-full p-3 pointer-cursor" style="position: relative;">
                    <div class="flex justify-center" style="margin-top: -50px;">
                        <button class="flex absolute top-0 right-0 m-3 items-center">
                            <div>Edit Profile</div>
                            <Icon icon="uil:edit" class="ml-2" />
                        </button>


                        <img src="https://thumbs.dreamstime.com/b/vector-illustration-smiling-shark-cartoon-minimalist-flat-style-isolated-white-background-315602043.jpg"
                            alt="Profile Avatar" class="profile-avatar" />
                    </div>
                    <div class="flex justify-center font-bold text-xl mt-2">
                        {{ userData.firstname }} {{ userData.lastname }}
                    </div>
                    <div class="flex justify-center font-bold text-sm italic gap-2">
                        <div class="flex-1 flex gap-2 justify-end">
                            <div class="text-yellow-300">
                                <Icon icon="iconamoon:email-duotone" height="20" />
                            </div>
                            <div>
                                {{ userData.email }}
                            </div>
                        </div>
                        |
                        <div class="flex-1 flex gap-2 justify-start">
                            <div class="text-blue-300">
                                <Icon icon="ph:phone-duotone" height="20" />
                            </div>
                            <div>
                                {{ userData.phone }}
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-center font-bold text-base mt-2">
                        <div class="flex-wrap flex-1">
                            <div class="flex justify-center text-pink-500">
                                <Icon icon="la:birthday-cake" height="30" />
                            </div>
                            <div class="text-center self-center">Sept. 09, 2002</div>
                        </div>
                        <Divider layout="vertical" />
                        <div class="flex-wrap flex-1">
                            <div class="flex justify-center text-purple-500">
                                <Icon icon="icons8:gender" height="30" />
                            </div>
                            <div class="text-center self-center">Male</div>
                        </div>
                        <Divider layout="vertical" />
                        <div class="flex-wrap flex-1">
                            <div class="flex justify-center text-green-500">
                                <Icon icon="entypo:address" height="30" />
                            </div>
                            <div class="flex justify-center text-center">Lumangbayan...</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-6 lg:col-span-6 xl:col-span-8">
                <div class="card w-full pointer-cursor p-5">
                    <div class="flex-wrap">
                        <div class="text-blue-400 mb-2">
                            <Icon icon="fluent-mdl2:reservation-orders" height="30" width="30" />
                        </div>
                        <div class="self-center font-bold text-base">
                            My Orders
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-6 lg:col-span-6 xl:col-span-8 ">
                <div class="card w-full pointer-cursor p-5">
                    <div class="flex-wrap">
                        <div class="text-green-400 mb-2">
                            <Icon icon="carbon:search-locate" height="30" width="30" />
                        </div>
                        <div class="self-center font-bold text-base">
                            Track Order
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-6 lg:col-span-6 xl:col-span-8 ">
                <div class="card w-full pointer-cursor p-5">
                    <div class="flex-wrap">
                        <div class="text-yellow-400 mb-2">
                            <Icon icon="mdi:guest-room" height="30" width="30" />
                        </div>
                        <div class="self-center font-bold text-base">
                            My Reservations
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-6 lg:col-span-6 xl:col-span-8 ">
                <div class="card w-full pointer-cursor p-5">
                    <div class="flex-wrap">
                        <div class="text-red-400 mb-2">
                            <Icon icon="ic:twotone-favorite" height="30" width="30" />
                        </div>
                        <div class="self-center font-bold text-base">
                            My Favorites
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-6 lg:col-span-6 xl:col-span-8 ">
                <div class="card w-full pointer-cursor p-5">
                    <div class="flex-wrap">
                        <div class="text-blue-400 mb-2">
                            <Icon icon="fluent:person-feedback-48-filled" height="30" width="30" />
                        </div>
                        <div class="self-center font-bold text-base">
                            Send Feedback
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-6 lg:col-span-6 xl:col-span-8 ">
                <div class="card w-full pointer-cursor p-5">
                    <div class="flex-wrap">
                        <div class="text-gray-400 mb-2">
                            <Icon icon="ic:outline-settings" height="30" width="30" />
                        </div>
                        <div class="self-center font-bold text-base">
                            Settings
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-8 ">

                <Button class="w-full " outlined @click="handleLogout">
                    <Icon icon="majesticons:logout-half-circle" height="30" width="30" />
                    <div class="font-bold">Log out</div>
                </Button>
            </div>

        </div>
    </div>



</template>

<style scoped>
.item-border {
    border: 2px solid #a7af4c;
    padding: 2px;
}

.profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 10px;
    border: 2px solid #4caf50;
    padding: 2px;
    display: block;
    /* Ensures it respects centering */
}
</style>
