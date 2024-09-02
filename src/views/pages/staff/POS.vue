<script setup>
import { ref } from 'vue';

const visible = ref(false);
</script>

<template>
    <div class="grid grid-cols-12 gap-3 -m-3">
        <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx-7 -my-7 xl:m-0">
            <div class="card mb-0 h-[84vh] sm:p-4 xl:p-8">
                <div class="grid grid-cols-12 mb-4 gap-2">
                    <div class="col-span-8 xl:col-span-5 mb-2">
                        <div class="flex flex-1 justify-start gap-2 font-bold">
                            <div class="xl:block">
                                <Button class="w-1/7" size="small">
                                    <Icon icon="uiw:filter" width="20" height="20" />
                                </Button>
                            </div>
                            <IconField iconPosition="left" class="w-full">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="searchTerm" placeholder="Search..." class="w-full" />
                            </IconField>
                            <div class="hidden xl:block">
                                <Button class="w-1/7" size="small">
                                    <Icon icon="cil:list" width="20" height="20" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-4 xl:col-span-7">
                        <div class="flex flex-1 justify-end gap-2">
                            <Button severity="info" class="w-full xl:w-auto" size="small">
                                <Icon icon="f7:envelope-fill" width="20" height="20" />
                                <div class="font-bold hidden sm:block">Note</div>
                            </Button>
                            <Button severity="info" class="w-full xl:w-auto" size="small">
                                <Icon icon="ion:person-add-sharp" width="20" height="20" />
                                <div class="font-bold hidden sm:block">Customer</div>
                            </Button>
                            <div class="hidden xl:block">
                                <Button class="w-full xl:w-auto" severity="success" size="small">
                                    <Icon icon="gridicons:add-outline" width="20" height="20" />
                                    <div class="font-bold hidden sm:block">New Order</div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold"
                    style="overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none;">
                    <Button rounded class="min-w-[5rem] xl:min-w-[5rem]"> All</Button>
                    <Button outlined rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small"> Drinks</Button>
                    <Button outlined rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small"> Drinks</Button>
                    <Button outlined rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small"> Drinks</Button>
                    <Button outlined rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small"> Drinks</Button>
                </div>
                <div class="grid grid-cols-12 h-auto my-2 gap-2 overflow-auto" style="max-height: calc(87vh - 160px)">
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2">
                        <div class="w-1/3 flex justify-center items-center xl:w-1/3">
                            <img src="https://iankewks.com/wp-content/uploads/2023/02/IMG_7014.jpg" alt="Item Image"
                                class="rounded-full w-[11vh] h-[11vh] object-cover item-border" />
                        </div>
                        <div class="w-1/3 pl-4 flex flex-col justify-center xl:w-2/3">
                            <div class="text-base font-bold">Sinigang na ulo ng bangus</div>
                            <div class="text-sm"> $XX.XX</div>
                            <div class="text-xs text-green-600">Available</div>
                        </div>
                        <div class="w-1/3 pl-4 flex flex-col justify-center xl:hidden block">
                            <Button rounded severity="success">
                                <Button rounded severity="success">
                                    <Icon icon="icomoon-free:plus" width="20" height="20" />
                                </Button>
                            </Button>
                        </div>
                    </div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2">
                        <div class="w-1/3 flex justify-center items-center xl:w-1/3">
                            <img src="https://api.lifegetsbetter.ph/uploads/recipes/featured/Red_Bulalo.jpg"
                                alt="Item Image" class="rounded-full w-[11vh] h-[11vh] object-cover item-border" />
                        </div>
                        <div class="w-1/3 pl-4 flex flex-col justify-center xl:w-2/3">
                            <div class="text-base font-bold">Item Name</div>
                            <div class="text-sm"> $XX.XX</div>
                            <div class="text-xs text-green-600">Available</div>
                        </div>
                        <div class="w-1/3 pl-4 flex flex-col justify-center xl:hidden block">
                            <Button rounded severity="success">
                                <Button rounded severity="success">
                                    <Icon icon="icomoon-free:plus" width="20" height="20" />
                                </Button>
                            </Button>
                        </div>
                    </div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2">
                        <div class="w-1/3 flex justify-center items-center xl:w-1/3">
                            <img src="https://kanamit.com.ph/cdn/shop/files/IMG_8406.jpg?v=1690875110" alt="Item Image"
                                class="rounded-full w-[11vh] h-[11vh] object-cover item-border" />
                        </div>
                        <div class="w-1/3 pl-4 flex flex-col justify-center xl:w-2/3">
                            <div class="text-base font-bold">Item Name</div>
                            <div class="text-sm"> $XX.XX</div>
                            <div class="text-xs text-green-600">Available</div>
                        </div>
                        <div class="w-1/3 pl-4 flex flex-col justify-center xl:hidden block">
                            <Button rounded severity="success">
                                <Button rounded severity="success">
                                    <Icon icon="icomoon-free:plus" width="20" height="20" />
                                </Button>
                            </Button>
                        </div>
                    </div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0">
                        aa</div>
                </div>
            </div>
        </div>
        <div class="hidden xl:block col-span-12 lg:col-span-6 xl:col-span-4">
            <div class="card mb-0 h-[84vh] flex flex-col">
                <div class="flex-grow overflow-auto">
                    <!-- Top part of the card containing the order number and control buttons -->
                    <div class="grid grid-cols-12 mb-4">
                        <div class="col-span-12 xl:col-span-5 mb-2">
                            <div class="flex flex-1 justify-start gap-2 font-bold">
                                <div class="text-2xl flex">Order #1234</div>
                            </div>
                        </div>
                        <div class="col-span-12 xl:col-span-7">
                            <div class="flex flex-1 justify-end gap-2">
                                <Button class="w-full xl:w-auto" severity="info" size="small">
                                    <Icon icon="fluent:folder-24-filled" width="20" height="20" />
                                    <div class="font-bold hidden sm:block">All Orders</div>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <!-- Middle part with dynamic content and controls -->
                    <div class="grid grid-cols-12 mb-4">
                        <div class="col-span-12 xl:col-span-12 mb-2">
                            <div class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold"
                                style="overflow-x: auto; white-space: no-wrap">
                                <Button rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small"> Dine in</Button>
                                <Button outlined rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small">Take
                                    out</Button>
                            </div>
                        </div>
                        <div class="col-span-12 xl:col-span-12 mb-2">
                            <div class="flex mb-3 gap-2">
                                <div>Data Table content here</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Bottom part that should stay at the very bottom -->
                <div class="w-full">
                    <div class="flex-wrap mb-3 gap-2">
                        <div class="flex mb-3">
                            <div class="flex justify-start px-4 bg-surface-500">
                                <span class="font-bold text-xl text-white self-center">Total Price</span>
                            </div>
                            <div class="flex-1 align-items-end text-end gap-2 align-self-end bg-green-100 text-black">
                                <span class="font-bold text-2xl pr-4">P 1000</span>
                            </div>
                        </div>
                        <div class="flex justify-content-end">
                            <div class="flex-1 text-end">
                                <Button severity="warn" outlined icon="pi pi-window-minimize" class="mr-2" size="small"
                                    label="Hold Order"></Button>
                                <Button severity="success" icon="pi pi-wallet" label="Proceed to Payment"
                                    size="small"></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="block xl:hidden">
        <Drawer v-model:visible="visible" header="Order #1234" position="right"
            :style="{ width: '90%', maxWidth: '100%' }">
            <div class="flex-grow overflow-auto h-[87%]">
                <!-- Top part of the card containing the order number and control buttons -->
                <div class="grid grid-cols-12 mb-4">
                    <div class="col-span-12 xl:col-span-5 mb-2">
                        <div class="flex flex-1 justify-start gap-2 font-bold">
                            <div class="text-2xl flex"></div>
                        </div>
                    </div>
                    <div class="col-span-12 xl:col-span-7">
                        <div class="flex flex-1 justify-end gap-2">
                            <Button class="w-full xl:w-auto" severity="info">
                                <Icon icon="fluent:folder-24-filled" width="20" height="20" />
                                <div class="font-bold sm:block">All Orders</div>
                            </Button>
                        </div>
                    </div>
                </div>
                <!-- Middle part with dynamic content and controls -->
                <div class="grid grid-cols-12 mb-4">
                    <div class="col-span-12 xl:col-span-12 mb-2">
                        <div class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold"
                            style="overflow-x: auto; white-space: no-wrap">
                            <Button rounded class="min-w-[5rem] xl:min-w-[10rem]"> Dine in</Button>
                            <Button outlined rounded class="min-w-[5rem] xl:min-w-[10rem]">Take out</Button>
                        </div>
                    </div>
                    <div class="col-span-12 xl:col-span-12 mb-2">
                        <div class="flex mb-3 gap-2">
                            <div>Data Table content here</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Bottom part that should stay at the very bottom -->
            <div class="w-full">
                <div class="flex-wrap mb-3 gap-2">
                    <div class="flex mb-3">
                        <div class="flex justify-start px-4 bg-surface-500">
                            <span class="font-bold text-xl text-white self-center">Total Price</span>
                        </div>
                        <div class="flex-1 align-items-end text-end gap-2 align-self-end bg-green-100 text-black">
                            <span class="font-bold text-2xl pr-4">P 1000</span>
                        </div>
                    </div>
                    <div class="flex justify-content-center">
                        <div class="flex-1 text-end gap-2 justify-center flex">
                            <Button severity="warn" class="w-1/3 xl:w-auto">
                                <Icon icon="solar:minimize-square-3-outline" width="20" height="20" />
                                <div class="font-bold hidden sm:block">Hold Order</div>
                            </Button>
                            <Button severity="success" class="w-2/3 xl:w-auto">
                                <Icon icon="ic:baseline-payments" width="20" height="20" />
                                <div class="font-bold">Payment</div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
        <Button
            style="position: absolute; top: calc(50% - 2rem); right: 0; border-top-left-radius: 40%; border-bottom-left-radius: 40%"
            @click="visible = true">
            <Icon icon="ic:baseline-shopping-cart" width="30" height="40" />
        </Button>
    </div>
</template>

<style>
.item-border {
    border: 2px solid #a7af4c;
    padding: 2px;
}
</style>
