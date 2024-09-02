<template>
    <div class="h-full mb-12">
        <!-- Container with background image, overlay, and text -->
        <div class="flex flex-col justify-center items-center bg-black-100 w-full relative"
            :style="{ height: 'calc(100vh - 100px)' }">
            <!-- Image -->
            <img src="@/assets/pics/BG.webp" class="object-cover xl:h-[20vh] h-full w-full" />
            <!-- Black overlay -->
            <div class="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
            <!-- Text over the image and overlay -->
            <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-xl">
                <div class="flex items-center justify-center flex-col">
                    <img src="@/assets/pics/logo.png" alt="" style="width: 300px;">
                    <span class="font-bold">Welcome to the resort and restaurant</span>
                </div>
            </div>
        </div>



        <div class="grid grid-cols-12 xl:gap-4 gap-4 mt-5">
            <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 gap-2">
                <div class="card p-0 h-auto pb-5 mx-2 mb-4">
                    <div class="flex relative ">
                        <img src="https://www.marthastewart.com/thmb/FnCeBr3wIJLbiQ5yum_lxbHBhwo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ashley-dan-wedding-ceremony-recessional-couple-0422-36ceedc8192f4d62bc0fa8bf42ea4faf.jpg"
                            class="object-cover xl:h-[20vh] h-[26vh] w-full rounded-t-lg" />
                    </div>
                    <div class="flex  pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                        <div class="xl:w-2/12"></div>
                        <div class="xl:w-70 flex-1 flex-wrap">
                            <div class="flex justify-between">
                                <div class="flex-wrap">
                                    <div class="text-2xl font-bold xl:text-4xl">Wedding event</div>
                                    <div class="text-sm italic xl:text-lg">Details here</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 gap-2">
                <div class="card p-0 h-auto pb-5 mx-2 mb-4">
                    <div class="flex relative ">
                        <img src="https://www.marthastewart.com/thmb/FnCeBr3wIJLbiQ5yum_lxbHBhwo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ashley-dan-wedding-ceremony-recessional-couple-0422-36ceedc8192f4d62bc0fa8bf42ea4faf.jpg"
                            class="object-cover xl:h-[20vh] h-[26vh] w-full rounded-t-lg" />
                    </div>
                    <div class="flex  pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                        <div class="xl:w-2/12"></div>
                        <div class="xl:w-70 flex-1 flex-wrap">
                            <div class="flex justify-between">
                                <div class="flex-wrap">
                                    <div class="text-2xl font-bold xl:text-4xl">Wedding event</div>
                                    <div class="text-sm italic xl:text-lg">Details here</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 gap-2">
                <div class="card p-0 h-auto pb-5 mx-2 mb-4">
                    <div class="flex relative ">
                        <img src="https://www.marthastewart.com/thmb/FnCeBr3wIJLbiQ5yum_lxbHBhwo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ashley-dan-wedding-ceremony-recessional-couple-0422-36ceedc8192f4d62bc0fa8bf42ea4faf.jpg"
                            class="object-cover xl:h-[20vh] h-[26vh] w-full rounded-t-lg" />
                    </div>
                    <div class="flex  pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                        <div class="xl:w-2/12"></div>
                        <div class="xl:w-70 flex-1 flex-wrap">
                            <div class="flex justify-between">
                                <div class="flex-wrap">
                                    <div class="text-2xl font-bold xl:text-4xl">Wedding event</div>
                                    <div class="text-sm italic xl:text-lg">Details here</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-9 text-xl font-bold" style="height: calc(100vh - 180px);">
            <div class="flex items-center flex-col ">
                <div class="mb-6">
                    <Icon icon="pajamas:location" width="50" height="50" class="text-yellow-500" />
                </div>
                <div class="text-center">
                    Bayabas St. Lalud, Calapan City, Oriental Mindoro, Philippines, 5200
                </div>
            </div>
            <div class="flex items-center flex-col mb-7">
                <div class=" mb-6">
                    <Icon icon="icon-park-outline:time" width="50" height="50" class="text-yellow-500" />
                </div>
                <div class="text-center">
                    Dinner
                    <br>
                    Tue-Thur & Sun 5pm - 9:30pm
                    <br>
                    Fri-Sat 5pm - 10:30pm
                    <br><br>
                    Lunch<br>
                    Tuesday - Sat 11:30pm - 3pm<br>
                    Sun: 11:30am - 4pm<br>
                    <br>
                    CLOSED MONDAY
                </div>
            </div>
            <div class="flex items-center flex-col mb-7">
                <div class="mb-6">
                    <Icon icon="mdi:phone-outline" width="50" height="50" class="text-yellow-500" />
                </div>
                <div class="text-center">
                    0992 410 3295
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
