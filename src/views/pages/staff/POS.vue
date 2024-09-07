<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

function handleStartClick() {
    router.push('/Staff/POS/Sell')
}

const visible = ref(false);
</script>

<template>
    <div class="grid grid-cols-12 gap-3 -m-3">
        <div class="col-span-12 lg:col-span-6 xl:col-span-12 xl:m-0 h-[80vh] flex flex-col justify-between">
            <!-- Your Cards Section -->
            <div class="grid grid-cols-12 gap-2">
                <div
                    class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2 mb-1">

                    <div class="w-full pl-4 flex flex-col justify-center xl:w-2/3">
                        <div class="text-xl font-bold">September 03, 2024</div>
                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-green-600 font-bold">Opened:</div>
                                <div> &nbsp; 8:30 am</div>
                            </div>
                            <div><span class="font-bold">Starting:&nbsp; </span> ₱200</div>
                        </div>

                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-red-400 font-bold">Closed:</div>
                                <div> &nbsp; 5:30 pm</div>
                            </div>
                            <div class="text-2xl text-primary"><span class="font-bold">Total:&nbsp; </span> ₱5000</div>
                        </div>
                    </div>
                </div>
                <div
                    class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2 mb-1">

                    <div class="w-full pl-4 flex flex-col justify-center xl:w-2/3">
                        <div class="text-xl font-bold">September 03, 2024</div>
                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-green-600 font-bold">Opened:</div>
                                <div> &nbsp; 8:30 am</div>
                            </div>
                            <div><span class="font-bold">Starting:&nbsp; </span> ₱200</div>
                        </div>

                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-red-400 font-bold">Closed:</div>
                                <div> &nbsp; 5:30 pm</div>
                            </div>
                            <div class="text-2xl text-primary"><span class="font-bold">Total:&nbsp; </span> ₱5000</div>
                        </div>
                    </div>
                </div>
                <div
                    class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2 mb-1">

                    <div class="w-full pl-4 flex flex-col justify-center xl:w-2/3">
                        <div class="text-xl font-bold">September 03, 2024</div>
                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-green-600 font-bold">Opened:</div>
                                <div> &nbsp; 8:30 am</div>
                            </div>
                            <div><span class="font-bold">Starting:&nbsp; </span> ₱200</div>
                        </div>

                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-red-400 font-bold">Closed:</div>
                                <div> &nbsp; 5:30 pm</div>
                            </div>
                            <div class="text-2xl text-primary"><span class="font-bold">Total:&nbsp; </span> ₱5000</div>
                        </div>
                    </div>
                </div>
                <div
                    class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2 mb-1">

                    <div class="w-full pl-4 flex flex-col justify-center xl:w-2/3">
                        <div class="text-xl font-bold">September 03, 2024</div>
                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-green-600 font-bold">Opened:</div>
                                <div> &nbsp; 8:30 am</div>
                            </div>
                            <div><span class="font-bold">Starting:&nbsp; </span> ₱200</div>
                        </div>

                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-red-400 font-bold">Closed:</div>
                                <div> &nbsp; 5:30 pm</div>
                            </div>
                            <div class="text-2xl text-primary"><span class="font-bold">Total:&nbsp; </span> ₱5000</div>
                        </div>
                    </div>
                </div>
                <div
                    class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2 mb-1">

                    <div class="w-full pl-4 flex flex-col justify-center xl:w-2/3">
                        <div class="text-xl font-bold">September 03, 2024</div>
                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-green-600 font-bold">Opened:</div>
                                <div> &nbsp; 8:30 am</div>
                            </div>
                            <div><span class="font-bold">Starting:&nbsp; </span> ₱200</div>
                        </div>

                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-red-400 font-bold">Closed:</div>
                                <div> &nbsp; 5:30 pm</div>
                            </div>
                            <div class="text-2xl text-primary"><span class="font-bold">Total:&nbsp; </span> ₱5000</div>
                        </div>
                    </div>
                </div>
                <div
                    class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2 mb-1">

                    <div class="w-full pl-4 flex flex-col justify-center xl:w-2/3">
                        <div class="text-xl font-bold">September 03, 2024</div>
                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-green-600 font-bold">Opened:</div>
                                <div> &nbsp; 8:30 am</div>
                            </div>
                            <div><span class="font-bold">Starting:&nbsp; </span> ₱200</div>
                        </div>

                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-red-400 font-bold">Closed:</div>
                                <div> &nbsp; 5:30 pm</div>
                            </div>
                            <div class="text-2xl text-primary"><span class="font-bold">Total:&nbsp; </span> ₱5000</div>
                        </div>
                    </div>
                </div>
                <div
                    class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2 mb-1">

                    <div class="w-full pl-4 flex flex-col justify-center xl:w-2/3">
                        <div class="text-xl font-bold">September 03, 2024</div>
                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-green-600 font-bold">Opened:</div>
                                <div> &nbsp; 8:30 am</div>
                            </div>
                            <div><span class="font-bold">Starting:&nbsp; </span> ₱200</div>
                        </div>

                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-red-400 font-bold">Closed:</div>
                                <div> &nbsp; 5:30 pm</div>
                            </div>
                            <div class="text-2xl text-primary"><span class="font-bold">Total:&nbsp; </span> ₱5000</div>
                        </div>
                    </div>
                </div>
                <div
                    class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2 mb-1">

                    <div class="w-full pl-4 flex flex-col justify-center xl:w-2/3">
                        <div class="text-xl font-bold">September 03, 2024</div>
                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-green-600 font-bold">Opened:</div>
                                <div> &nbsp; 8:30 am</div>
                            </div>
                            <div><span class="font-bold">Starting:&nbsp; </span> ₱200</div>
                        </div>

                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-red-400 font-bold">Closed:</div>
                                <div> &nbsp; 5:30 pm</div>
                            </div>
                            <div class="text-2xl text-primary"><span class="font-bold">Total:&nbsp; </span> ₱5000</div>
                        </div>
                    </div>
                </div>
                <div
                    class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2 mb-1">

                    <div class="w-full pl-4 flex flex-col justify-center xl:w-2/3">
                        <div class="text-xl font-bold">September 03, 2024</div>
                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-green-600 font-bold">Opened:</div>
                                <div> &nbsp; 8:30 am</div>
                            </div>
                            <div><span class="font-bold">Starting:&nbsp; </span> ₱200</div>
                        </div>

                        <div class="text-base flex justify-between px-3">
                            <div class="flex">
                                <div class="text-red-400 font-bold">Closed:</div>
                                <div> &nbsp; 5:30 pm</div>
                            </div>
                            <div class="text-2xl text-primary"><span class="font-bold">Total:&nbsp; </span> ₱5000</div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Start Selling Button at the Bottom -->
            <div class="flex w-full fixed justify-center bottom-0 left-1/2 transform -translate-x-1/2 mb-1 ">
                <Button class="w-10/12" severity="success" style="height: 4rem;" @click="visible = true">
                    <Icon icon="hugeicons:cashier" width="20" height="20" />
                    <div class="font-bold sm:block">Start Selling</div>
                </Button>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visible" modal header="Start Session" :style="{ width: '25rem' }">
        <div class="flex items-center gap-4 mb-4">
            <label for="username" class="font-semibold w-24">Starting Cash</label>
            <InputText id="username" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
            <Button type="button" @click="handleStartClick" label="Start" style="width: 9rem;"></Button>
        </div>
    </Dialog>

</template>

<style>
.item-border {
    border: 2px solid #a7af4c;
    padding: 2px;
}
</style>
