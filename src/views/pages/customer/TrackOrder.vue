<script setup>
import { ref } from 'vue';
const events = ref([
    { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
    { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
]);
</script>

<template>
    <div class="flex text-xl font-bold pt-4 pb-5 pl-4 bg-surface-900">
        TRACK ORDER
    </div>
    <div class="grid grid-cols-12 gap-3 px-3">
        <div class="col-span-12">
            <div class="flex p-4">
                <div class="flex-1 flex justify-center">
                    <div class="flex-wrap text-center">
                        <div>Estimated Time</div>
                        <div class="text-xl font-bold pt-2">30 mins</div>
                    </div>
                </div>
                <div class="flex-1 flex justify-center">
                    <div class="flex-wrap text-center">
                        <div>Order Number</div>
                        <div class="text-xl font-bold pt-2">#209</div>
                    </div>
                </div>
            </div>
            <Divider />

        </div>

        <div class="col-span-12 p-3">

            <ol class="relative ms-3 border-s border-gray-200 dark:border-gray-700 ">
                <li class="mb-10 ms-6  flex gap-3">
                    <div class="dark:text-primary-500">
                        <Icon icon="material-symbols:order-approve-rounded" height="40" />
                    </div>

                    <span
                        class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white dark:bg-primary-500 dark:ring-gray-800">
                        <Icon icon="ic:baseline-check" class="text-primary-900" />
                    </span>
                    <div>
                        <h4 class="mb-0.5 text-base font-semibold">Order Confirmed</h4>
                        <p class="text-sm dark:text-primary-500">Order was placed on 10:51 am</p>
                    </div>
                </li>
                <li class="mb-10 ms-6  flex gap-3">
                    <div class="dark:text-primary-500">
                        <Icon icon="game-icons:camp-cooking-pot" height="40" />
                    </div>

                    <span
                        class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white dark:bg-primary-500 dark:ring-gray-800">
                        <Icon icon="ic:baseline-check" class="text-primary-900" />
                    </span>
                    <div>
                        <h4 class="mb-0.5 text-base font-semibold">Preparing in Kitchen</h4>
                        <p class="text-sm dark:text-primary-500">Your order is being prepared, kindly wait</p>
                    </div>
                </li>
                <li class="mb-10 ms-6  flex gap-3">
                    <div class="dark:text-primary-500">
                        <Icon icon="streamline:serving-dome-solid" height="40" />
                    </div>

                    <span
                        class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white dark:bg-primary-500 dark:ring-gray-800">
                        <Icon icon="ic:baseline-check" class="text-primary-900" />
                    </span>
                    <div>
                        <h4 class="mb-0.5 text-base font-semibold">Serving Order</h4>
                        <p class="text-sm dark:text-primary-500">Your Order is on its way to you</p>
                    </div>
                </li>
                <li class="mb-10 ms-6  flex gap-3">
                    <div class="dark:text-primary-s500">
                        <Icon icon="game-icons:meal" height="40" />
                    </div>

                    <span
                        class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white dark:bg-primary-50s0 dark:ring-gray-800">
                        <Icon icon="line-md:loading-twotone-loop" class="text-primary-900" />
                    </span>
                    <div>
                        <h4 class="mb-0.5 text-base font-semibold">Order Served</h4>
                        <p class="text-sm dark:text-primary-500">Get ready to enjoy your meal!</p>
                    </div>
                </li>


            </ol>

            <div class="gap-4 sm:flex sm:items-center">


                <Button @click="visible = true" severity="info" class="w-full h-[3.4rem] p-0">
                    <div class="flex justify-between w-full">

                        <div class="flex flex-1 justify-center">
                            <span class=" font-bold">My Order Details</span>
                        </div>

                    </div>
                </Button>
            </div>
        </div>

    </div>




</template>

<style scoped></style>