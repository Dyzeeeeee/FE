<template>
    <div class="grid grid-cols-12 grid grid-cols-12 xl:gap-3 gap-1 -mx-5 xl:-mx-3">
        <div class="hidden xl:block h-full w-full justify-center flex flex-col items-center">
            <div class=" flex justify-center w-full ">
                <img src="@/assets/pics/sorry.png" alt="" class="h-[50%] w-[50%]">
            </div>
        </div>
        <div class="col-span-12">
            <div class="xl:hidden block h-full mb-[3em] pb-[0rem] ">
                <div class="flex flex-col w-full relative items-center overflow-hidden"
                    :style="{ height: 'calc(55vh)' }">
                    <div style="border-bottom-left-radius: 100%; border-bottom-right-radius: 100%; width: 120vw;"
                        class="bg-emerald-600 h-[95%] border-b-[2rem] border-emerald-800 overflow-hidden relative">
                        <!-- Control Buttons -->


                        <div class="" :class="{ 'block': currentSlide === 0, 'hidden': currentSlide !== 0 }">
                            <div class="absolute top-0 left-0 w-full h-full object-cover">
                                <img src="https://images.summitmedia-digital.com/spotph/images/2023/04/21/halo-halo-1200-1682007650.jpg"
                                    alt="" style="height: 100% ; width: 100%" class="object-cover">
                            </div>
                            <div class="absolute top-0 left-0 w-full h-full bg-black opacity-30"></div>

                            <div
                                class="absolute items-center gap-4 justify-center h-full flex flex-col text-4xl px-[15%] text-center">
                                <div class="opacity-100 text-primary font-bold text-stroke">Beat the heat with our
                                    coolers</div>
                                <div><Button rounded class="font-bold">
                                        <div class="px-5"> Order Now</div>
                                    </Button></div>
                            </div>
                        </div>
                        <div :class="{ 'block': currentSlide === 1, 'hidden': currentSlide !== 1 }">
                            <div class="absolute top-0 left-0 w-full h-full object-cover">
                                <img src="https://www.hawkscay.com/resources/media/user/1586185018-1585252667-Events_Header_1920x800_desktop_desktop.jpg"
                                    alt="" style="height: 100% ; width: 100%" class="object-cover">
                            </div>
                            <div class="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>

                            <div
                                class="absolute items-center gap-4 justify-center h-full flex flex-col text-4xl px-[15%] text-center">
                                <div class="opacity-100 text-primary font-bold text-stroke">Make the most of your
                                    celebrations
                                </div>
                                <div><Button rounded class="font-bold">
                                        <div class="px-5"> Make Reservation</div>
                                    </Button></div>
                            </div>
                        </div>
                        <div :class="{ 'block': currentSlide === 2, 'hidden': currentSlide !== 2 }">
                            <div class="absolute top-0 left-0 w-full h-full object-cover">
                                <img src="https://images.squarespace-cdn.com/content/v1/58d992679f7456278c817768/1584200941056-U8627QFB9INGLMZ0TEZ9/family-of-three-lying-on-bed-showing-feet-while-covered-with-1021051.jpg"
                                    alt="" style="height: 100% ; width: 100%" class="object-cover">
                            </div>
                            <div class="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>

                            <div
                                class="absolute items-center gap-4 justify-center h-full flex flex-col text-4xl px-[15%] text-center">
                                <div class="opacity-100 text-primary font-bold text-stroke">Make the most of your
                                    celebrations
                                </div>
                                <div><Button rounded class="font-bold">
                                        <div class="px-5"> Make Reservation</div>
                                    </Button></div>
                            </div>
                        </div>
                        <div class="gap-4 flex absolute left-1/2 bottom-5 transform -translate-x-1/2">
                            <button @click="currentSlide = 0"
                                class="  text-black flex justify-center items-center  self-center rounded-full h-[2rem] w-[2rem]"
                                :class="{ 'bg-primary': currentSlide === 0, 'bg-gray-500': currentSlide !== 0 }">
                                <Icon icon="mdi:food-drumstick" />
                            </button>
                            <button @click="currentSlide = 1"
                                class=" bg-gray-500 text-black flex justify-center items-center  self-center rounded-full h-[2rem] w-[2rem]"
                                :class="{ 'bg-primary': currentSlide === 1, 'bg-gray-500': currentSlide !== 1 }">

                                <Icon icon="material-symbols:event-sharp" />
                            </button>
                            <button @click="currentSlide = 2"
                                class=" bg-gray-500 text-black flex justify-center items-center  self-center rounded-full h-[2rem] w-[2rem]"
                                :class="{ 'bg-primary': currentSlide === 2, 'bg-gray-500': currentSlide !== 2 }">
                                <Icon icon="mingcute:sleep-line" />
                            </button>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>


                <div class="grid grid-cols-12 gap-4 mt-5">
                    <div class="col-span-12 lg:col-span-6 xl:col-span-4">
                        <div
                            class="card p-0 h-auto min-h-[15rem] pb-5 mx-5 mb-4 border-[2px] transition duration-300 ease-in-out transform ">
                            <div class="flex relative">
                                <img :src="itemImage" class="object-cover xl:h-48 h-36 w-full rounded-t-lg" />
                            </div>
                            <div class="flex pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                                <div class="xl:w-2/12"></div>
                                <div class="xl:w-10/12 flex-1 flex-wrap">
                                    <div class="flex justify-between">
                                        <div class="flex-wrap">
                                            <div class="text-2xl font-bold xl:text-4xl">November’s Star Dish: <span
                                                    class="text-yellow-500"> <br>{{ itemName
                                                    }}</span>
                                            </div>
                                            <div class="text-sm italic xl:text-lg">{{ itemDesc }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="card p-0 h-auto min-h-[15rem] pb-5 mx-5 mb-4 border-[2px] transition duration-300 ease-in-out transform ">
                            <div class="flex relative">
                                <img src="https://www.princehotels.com/hiroshima/wp-content/uploads/sites/19/2019/07/Superior-Floor-Luxury-Family-1-Grand-Prince-Hotel-Hiroshima.jpg.jpg"
                                    class="object-cover xl:h-48 h-36 w-full rounded-t-lg" />
                            </div>
                            <div class="flex pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                                <div class="xl:w-2/12"></div>
                                <div class="xl:w-10/12 flex-1 flex-wrap">
                                    <div class="flex justify-between">
                                        <div class="flex-wrap">
                                            <div class="text-2xl font-bold xl:text-4xl">New deals now available!</div>
                                            <div class="text-sm italic xl:text-lg">Make everyday a win with these
                                                app-exclusive
                                                deals!
                                                Claim it via Dine-In. Take Out or Drive thru.
                                                etc. now baby pull me closer to the backseat of your rover
                                                i like me better when I’m with you.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="card p-0 h-auto min-h-[15rem] pb-5 mx-5 mb-4 border-[2px] transition duration-300 ease-in-out transform ">
                            <div class="flex relative">
                                <img src="https://www.marthastewart.com/thmb/FnCeBr3wIJLbiQ5yum_lxbHBhwo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ashley-dan-wedding-ceremony-recessional-couple-0422-36ceedc8192f4d62bc0fa8bf42ea4faf.jpg"
                                    class="object-cover xl:h-48 h-36 w-full rounded-t-lg" />
                            </div>
                            <div class="flex pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                                <div class="xl:w-2/12"></div>
                                <div class="xl:w-10/12 flex-1 flex-wrap">
                                    <div class="flex justify-between">
                                        <div class="flex-wrap">
                                            <div class="text-2xl font-bold xl:text-4xl">New deals now available!</div>
                                            <div class="text-sm italic xl:text-lg">Make everyday a win with these
                                                app-exclusive
                                                deals!
                                                Claim it via Dine-In. Take Out or Drive thru.
                                                etc. now baby pull me closer to the backseat of your rover
                                                i like me better when I’m with you.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-6 xl:col-span-4 mt-4">
                    <div class="flex p-2 gap-4 h-full justify-center">
                        <div class="w-[70%] h-full border-[1px] rounded-xl">
                            <video loop playsinline autoplay controls preload="auto" class="border-[1px] rounded-xl">
                                <source src="@/assets/pics/Anahaw.mp4" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div class="flex flex-col w-[20%] gap-4">
                            <img src="@/assets/pics/coffee.jpg" alt="" class="h-[50%] w-full border-[1px] rounded-xl">
                            <img src="@/assets/pics/music.jpg" alt="" class="h-[50%] w-full border-[1px] rounded-xl">
                        </div>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-6 xl:col-span-4 mt-4">
                    <div class="flex flex-col p-2 gap-2 h-full items-center px-3">
                        <div class="text-primary text-3xl font-bold ">
                            Where We Are
                        </div>
                        <div>
                            Brgy. Balite, Calapan City, Oriental Mindoro
                        </div>
                        <div class="w-full rounded-xl  border-[3px]">
                            <iframe class="rounded-xl "
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3880.9344426344132!2d121.1585403748767!3d13.416385004971206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bceece975a1a9d%3A0xe9752d2738d90944!2sAnahaw%20Island%20View%20Resort!5e0!3m2!1sen!2sph!4v1727778034647!5m2!1sen!2sph"
                                height="200" width="100%" style="border:0;" allowfullscreen="" loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>
                <Divider />

                <div class="flex px-2 text-sm">
                    <div class="w-[30%]">
                        <div class="flex-wrap">
                            <div>
                                Anahaw@email.com
                            </div>
                            <div>
                                +639123321123
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 flex justify-end">
                        <div class="flex-wrap">
                            <div class="text-end">
                                ©2001 Anahaw Island View Resort

                            </div>
                            <div class="flex justify-end gap-2">
                                <Icon icon="logos:facebook" height="25" />
                                <Icon icon="skill-icons:instagram" height="25" />
                                <Icon icon="pajamas:twitter" height="25" />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Chatbot />

</template>

<style scoped>
.text-stroke {
    /* Foreground color */
    text-shadow:
        -1px -1px 0 #000000,
        1px -1px 0 #ff0000,
        -1px 1px 0 #000,
        1px 1px 0 #ff0000,
        0px -1px 0 #ff0000,
        -1px 0px 0 #ff0000,
        1px 0px 0 #ff0000,
        0px 1px 0 #ff0000;
    /* Creating a thick black shadow around the text */
}
</style>


<script setup>
import { baseImageUrl } from '@/config'; // Make sure the path is correct based on your project structure

import Chatbot from '@/components/Chatbot.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const mostFrequentMenuItem = ref(null); // Holds the data of the most frequent menu item

const itemImage = ref(null);
const itemName = ref(null);
const itemDesc = ref(null);
// Function to fetch the most frequent menu item
const fetchMostFrequentMenuItem = async () => {
    try {
        const response = await axios.get('/get-most-frequent-menu-item');
        const data = response.data;

        // Append the base URL to the menu_image using encodeURIComponent
        if (data && data.menu_image) {
            data.menu_image = `${baseImageUrl}${encodeURIComponent(data.menu_image)}`;
            itemImage.value = data.menu_image;
            itemName.value = data.menu_name;
            itemDesc.value = data.menu_description;
        }

        console.log(itemImage.value)
        mostFrequentMenuItem.value = data; // Assuming the API returns { menu_item_id, menu_name, menu_image, frequency }
    } catch (error) {
        console.error('Failed to fetch most frequent menu item:', error);
    }
};




// Fetch the data on component mount
onMounted(() => {
    fetchMostFrequentMenuItem();
});

const currentSlide = ref(0);
</script>