<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, watch } from 'vue';
const { toggleDarkMode, isDarkTheme } = useLayout();

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
    <!-- <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
        <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
    </button> -->
    <div class="grid grid-cols-12 grid grid-cols-12 xl:gap-3 gap-1 -mx-5 xl:-mx-3">
        <div class="col-span-12">
            <div class="">
                <div class="flex text-xl font-bold pt-4 pb-5 pl-4">
                    <!-- ROOMS   -->
                </div>
                <div class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold"
                    style="overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none;">
                    <Button rounded class="min-w-[5rem] xl:min-w-[5rem]"> All</Button>
                    <Button outlined rounded class="min-w-[8rem] xl:min-w-[7rem]" size="small"> Air conditioned</Button>
                    <Button outlined rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small"> Cottage</Button>
                    <Button outlined rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small"> Deluxe</Button>
                    <Button outlined rounded class="min-w-[5rem] xl:min-w-[7rem]" size="small"> Drinks</Button>
                </div>

                <div class="grid grid-cols-12 xl:gap-4 gap-4 mt-5 pb-12 mb-12">
                    <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 gap-2">
                        <div class="card p-0 h-auto mx-2 mb-4">
                            <div class="flex">
                                <img src="@/assets/pics/travelers.jpg"
                                    class="object-cover xl:h-[20vh] h-auto w-1/3 rounded-lg" />
                                <div class="flex flex-col flex-1">
                                    <div class="p-4">
                                        <div class="text-xl font-bold xl:text-4xl">Traveler's Room</div>
                                        <div class="text-sm italic xl:text-lg">free breakfast for 2 persons</div>
                                        <div class="italic flex self-center">
                                            <Icon icon="mdi:star" width="20" height="20" class="text-yellow-500" />
                                            <div class="ml-1 font-normal">6.4 • </div>
                                            <div class="ml-1 font-light">20 reviews</div>
                                        </div>
                                    </div>
                                    <div class="p-3 text-right">
                                        <div class="text-base xl:text-4xl"><span class="font-bold">Capacity:</span> 1
                                            bed
                                        </div>
                                        <div class="text-base xl:text-lg">Price for 1 night and 2 adults</div>
                                        <div class="text-2xl xl:text-lg font-bold">₱1300.00</div>
                                    </div>
                                    <div class="p-3 text-right flex gap-2">
                                        <Button outlined severity="info" class="w-full">
                                            <!-- <Icon icon="clarity:remove-solid" width="15" height="15" /> -->
                                            <div class="font-bold ">View</div>
                                        </Button>
                                        <Button class="w-full">
                                            <div class="font-bold ">Reserve</div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card p-0 h-auto mx-2 mb-4">
                            <div class="flex">
                                <img src="@/assets/pics/travelers.jpg"
                                    class="object-cover xl:h-[20vh] h-auto w-1/3 rounded-lg" />
                                <div class="flex flex-col flex-1">
                                    <div class="p-4">
                                        <div class="text-xl font-bold xl:text-4xl">Traveler's Room</div>
                                        <div class="text-sm italic xl:text-lg">free breakfast for 2 persons</div>
                                        <div class="italic flex self-center">
                                            <Icon icon="mdi:star" width="20" height="20" class="text-yellow-500" />
                                            <div class="ml-1 font-normal">6.4 • </div>
                                            <div class="ml-1 font-light">20 reviews</div>
                                        </div>
                                    </div>
                                    <div class="p-3 text-right">
                                        <div class="text-base xl:text-4xl"><span class="font-bold">Capacity:</span> 1
                                            bed
                                        </div>
                                        <div class="text-base xl:text-lg">Price for 1 night and 2 adults</div>
                                        <div class="text-2xl xl:text-lg font-bold">₱1300.00</div>
                                    </div>
                                    <div class="p-3 text-right flex gap-2">
                                        <Button outlined severity="info" class="w-full">
                                            <!-- <Icon icon="clarity:remove-solid" width="15" height="15" /> -->
                                            <div class="font-bold ">View</div>
                                        </Button>
                                        <Button class="w-full">
                                            <div class="font-bold ">Reserve</div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 gap-2">
                        <div class="card p-0 h-auto mx-2 mb-4">
                            <div class="flex">
                                <img src="@/assets/pics/travelers.jpg"
                                    class="object-cover xl:h-[20vh] h-auto w-1/3 rounded-lg" />
                                <div class="flex flex-col flex-1">
                                    <div class="p-4">
                                        <div class="text-xl font-bold xl:text-4xl">Traveler's Room</div>
                                        <div class="text-sm italic xl:text-lg">free breakfast for 2 persons</div>
                                        <div class="italic flex self-center">
                                            <Icon icon="mdi:star" width="20" height="20" class="text-yellow-500" />
                                            <div class="ml-1 font-normal">6.4 • </div>
                                            <div class="ml-1 font-light">20 reviews</div>
                                        </div>
                                    </div>
                                    <div class="p-3 text-right">
                                        <div class="text-base xl:text-4xl"><span class="font-bold">Capacity:</span> 1
                                            bed
                                        </div>
                                        <div class="text-base xl:text-lg">Price for 1 night and 2 adults</div>
                                        <div class="text-2xl xl:text-lg font-bold">₱1300.00</div>
                                    </div>
                                    <div class="p-3 text-right flex gap-2">
                                        <Button outlined severity="info" class="w-full">
                                            <!-- <Icon icon="clarity:remove-solid" width="15" height="15" /> -->
                                            <div class="font-bold ">View</div>
                                        </Button>
                                        <Button class="w-full">
                                            <div class="font-bold ">Reserve</div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 gap-2">
                        <div class="card p-0 h-auto mx-2 mb-4">
                            <div class="flex">
                                <img src="@/assets/pics/travelers.jpg"
                                    class="object-cover xl:h-[20vh] h-auto w-1/3 rounded-lg" />
                                <div class="flex flex-col flex-1">
                                    <div class="p-4">
                                        <div class="text-xl font-bold xl:text-4xl">Traveler's Room</div>
                                        <div class="text-sm italic xl:text-lg">free breakfast for 2 persons</div>
                                        <div class="italic flex self-center">
                                            <Icon icon="mdi:star" width="20" height="20" class="text-yellow-500" />
                                            <div class="ml-1 font-normal">6.4 • </div>
                                            <div class="ml-1 font-light">20 reviews</div>
                                        </div>
                                    </div>
                                    <div class="p-3 text-right">
                                        <div class="text-base xl:text-4xl"><span class="font-bold">Capacity:</span> 1
                                            bed
                                        </div>
                                        <div class="text-base xl:text-lg">Price for 1 night and 2 adults</div>
                                        <div class="text-2xl xl:text-lg font-bold">₱1300.00</div>
                                    </div>
                                    <div class="p-3 text-right flex gap-2">
                                        <Button outlined severity="info" class="w-full">
                                            <!-- <Icon icon="clarity:remove-solid" width="15" height="15" /> -->
                                            <div class="font-bold ">View</div>
                                        </Button>
                                        <Button class="w-full">
                                            <div class="font-bold ">Reserve</div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fixed bottom-12 right-7 transform mb-4 ">
                    <Button @click="visibleahsdg = true" severity="info"
                        style="border-radius: 9999px; width: 13rem; height: auto; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top: 1rem; padding-bottom: 1rem; position: relative;">
                        <div class="flex flex-col items-center">
                            <div class="flex justify-center">
                                <Icon icon="mdi:queue" width="20" height="20" />
                                <span class="ml-1 font-bold">Reserve now</span>
                            </div>
                        </div>

                        <!-- PrimeVue Badge Component with custom styling for positioning -->
                    </Button>


                </div>

            </div>

        </div>
    </div>
</template>

<style scoped>
.item-border {
    border: 2px solid #a7af4c;
    padding: 2px;
}
</style>
