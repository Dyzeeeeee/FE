<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref } from 'vue';
const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();

const visible = ref(false);
</script>

<template>
    <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
        <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
    </button>
    <div class="flex text-xl font-bold pt-4 pb-5 pl-4">
        MENU
    </div>
    <div class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold"
        style="overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none;">
        <Button rounded class="min-w-[5rem] xl:min-w-[5rem]"> All</Button>
        <Button outlined rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small"> Drinks</Button>
        <Button outlined rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small"> Drinks</Button>
        <Button outlined rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small"> Drinks</Button>
        <Button outlined rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small"> Drinks</Button>
    </div>

    <div class="grid grid-cols-12 xl:gap-4 gap-4 mt-5 pb-12 mb-12">
        <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 gap-2">
            <div class="card p-0 h-auto pb-5 mx-2 mb-4 ">
                <div class="flex relative ">
                    <div
                        class="text-3xl p-2 absolute bg-red-500 dark:bg-red-500 rounded-r-lg text-white dark:text-white  font-bold bottom-3">
                        ₱100
                    </div>
                    <img src="@/assets/pics/SisigRice.jpg"
                        class="object-cover xl:h-[20vh] h-[15vh] w-full rounded-t-lg" />
                </div>
                <div class="flex  pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                    <div class="xl:w-2/12"></div>
                    <div class="xl:w-70 flex-1 flex-wrap">
                        <div class="flex justify-between w-full">
                            <div class="flex flex-col">
                                <div class="text-2xl font-bold xl:text-4xl">Sisig Rice</div>
                                <div class="text-sm italic xl:text-lg">10-15 minutes</div>
                            </div>
                            <div class="self-center px-4">
                                <Button size="small" rounded>
                                    Add to Order
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 gap-2">
            <div class="card p-0 h-auto pb-5 mx-2 mb-4">
                <div class="flex relative ">
                    <div class="text-3xl p-2 absolute bg-red-500 rounded-r-lg  font-bold bottom-3">
                        ₱100
                    </div>
                    <img src="@/assets/pics/SisigRice.jpg"
                        class="object-cover xl:h-[20vh] h-[15vh] w-full rounded-t-lg" />
                </div>
                <div class="flex  pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                    <div class="xl:w-2/12"></div>
                    <div class="xl:w-70 flex-1 flex-wrap">
                        <div class="flex justify-between w-full">
                            <div class="flex flex-col">
                                <div class="text-2xl font-bold xl:text-4xl">Sisig Rice</div>
                                <div class="text-sm italic xl:text-lg">10-15 minutes</div>
                            </div>
                            <div class="self-center px-4">
                                <Button size="small" rounded>
                                    Add to Order
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 gap-2">
            <div class="card p-0 h-auto pb-5 mx-2 mb-4">
                <div class="flex relative ">
                    <div class="text-3xl p-2 absolute bg-red-500 rounded-r-lg  font-bold bottom-3">
                        ₱100
                    </div>
                    <img src="@/assets/pics/SisigRice.jpg"
                        class="object-cover xl:h-[20vh] h-[15vh] w-full rounded-t-lg" />
                </div>
                <div class="flex  pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                    <div class="xl:w-2/12"></div>
                    <div class="xl:w-70 flex-1 flex-wrap">
                        <div class="flex justify-between w-full">
                            <div class="flex flex-col">
                                <div class="text-2xl font-bold xl:text-4xl">Sisig Rice</div>
                                <div class="text-sm italic xl:text-lg">10-15 minutes</div>
                            </div>
                            <div class="self-center px-4">
                                <Button size="small" rounded>
                                    Add to Order
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-3">
        <Badge value="3" severity="danger" style="position: absolute; top: 0; right: 0; z-index: 99;">
        </Badge>
        <Button @click="visible = true" severity="info"
            style="border-radius: 9999px; width: 13rem; height: 5rem; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top: 0.5rem; position: relative;">
            <div class="flex flex-col items-center">
                <div class="flex justify-center">
                    <Icon icon="ic:baseline-shopping-cart" width="20" height="20" />
                    <span class="ml-1 font-bold">My order</span>
                </div>
            </div>

            <!-- PrimeVue Badge Component with custom styling for positioning -->

        </Button>


    </div>


    <Drawer v-model:visible="visible" header="My Order" position="bottom" class="opacity-90"
        :style="{ width: '100%', height: '85vh' }">
        <div class="flex flex-col h-full ">
            <div class="flex-grow overflow-auto">
                <div class="grid grid-cols-12 mb-4">
                    <div class="col-span-12 mb-2">
                        <div class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold"
                            style="overflow-x: auto; white-space: no-wrap;">
                            <Button rounded class="min-w-[5rem] xl:min-w-[10rem]"> Dine in</Button>
                            <Button outlined rounded class="min-w-[5rem] xl:min-w-[10rem]">Take
                                out</Button>
                        </div>
                    </div>
                    <div class="col-span-12 mb-2 bg-">
                        <Divider />
                        <div class="flex gap-2 ">
                            <div class="font-bold text-xl self-center ml-3 w-[50%]">
                                Iced Coffee
                            </div>
                            <div class="w-[40%] self-center flex-wrap">
                                <div class="flex justify-end itaic font-bold text-lg">
                                    P100
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2 pt-2 justify-between">
                            <div style="width: 30%; height: 30px" class="">
                                <Button severity="danger" class="w-full h-full" size="small">
                                    <!-- <Icon icon="clarity:remove-solid" width="15" height="15" /> -->
                                    <div class="font-bold ">Remove</div>
                                </Button>
                            </div>
                            <div style="width: 40%;">
                                <InputGroup class="w-full " style="height: 30px ">
                                    <Button severity="primary" size="small" class="w-4/12 h-full">
                                        <Icon icon="ic:sharp-minus" width="15" height="15" />
                                    </Button>
                                    <InputText placeholder="0" class="h-full" />
                                    <Button severity=" primary" size="small" class="w-4/12 h-full">
                                        <Icon icon="ic:sharp-plus" width="15" height="15" />
                                    </Button>
                                </InputGroup>
                            </div>
                            <div style="width: 30%; height: 30px">
                                <Button severity="info" class="w-full h-full" size="small">
                                    <Icon icon="bx:food-menu" width="15" height="15" />
                                    <div class="font-bold ">Details</div>
                                </Button>
                            </div>
                        </div>

                        <Divider />


                    </div>
                </div>
            </div>
            <div class="w-full">
                <div class="flex-wrap mb-3 gap-2">
                    <div class="flex mb-3">
                        <div class="flex justify-start px-4 bg-surface-500">
                            <span class="font-bold text-xl text-white self-center">Total Price</span>
                        </div>
                        <div class="flex-1 text-end gap-2 align-self-end bg-green-100 text-black">
                            <span class="font-bold text-2xl pr-4">P 1000</span>
                        </div>
                    </div>
                    <div class="flex justify-center">
                        <div class="flex-1 text-end gap-2 justify-center flex ">
                            <Button severity="success" class="w-full xl:w-auto">
                                <Icon icon="ic:baseline-payments" width="20" height="20" />
                                <div class="font-bold">Confirm Order</div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Drawer>



</template>

<style scoped>
.item-border {
    border: 2px solid #a7af4c;
    padding: 2px;
}
</style>
