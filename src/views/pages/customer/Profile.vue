<template>
    <div class="grid grid-cols-12 xl:gap-1 gap-2">
        <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 gap-2">
            <div class="card p-0 h-auto pb-5">
                <div class="flex relative">
                    <img src="https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80"
                        class="object-cover xl:h-[20vh] h-[18vh] w-full" />
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFICcql4ZvAAs3kWwFfW_7ZtPWblMi5zXdSQ&s"
                        class="absolute bottom-0 left-0 transform xl:translate-y-1/2 translate-y-1/4 rounded-full border-4 border-blue-500 xl:ml-7 ml-3 h-[15vh] xl:[h-20]" />
                </div>
                <div class="flex mt-7 pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                    <div class="xl:w-2/12"></div>
                    <div class="xl:w-70 flex-1 flex-wrap">
                        <div class="flex justify-between">
                            <div class="flex-wrap">
                                <div class="text-2xl font-bold xl:text-4xl">Jan Dyze Malaluan</div>
                                <div class="text-sm italic xl:text-lg">Cashier</div>
                            </div>
                            <div class="mr-3">
                                <Button severity="info" outlined rounded>
                                    <Icon icon="tabler:edit" width="20" height="20" />
                                    <div class="font-bold hidden sm:block">Edit profile</div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card p-0 h-auto pb-5 ">
                sasasssss

            </div>

        </div>
    </div>

    <button type="button" @click="handleLogout">
        <i class="pi pi-power-off"></i>
        <span>Logout</span>
    </button>


</template>

<style scoped></style>

<script setup>
import router from '@/router';
import axios from 'axios';
const handleLogout = async () => {
    try {
        // Call backend logout endpoint
        await axios.post('/logout', {}, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        });

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
</script>