<template>
    <div class="grid grid-cols-12 xl:gap-3 gap-2 -mx-5 xl:-mx-3 mb-10 mt-12">
        <div class="col-span-12 xl:col-span-12 items-center bg-surface-800]"
            :class="['fixed top-0 left-0 right-0 z-50', isRounded ? 'mt-2 p-2 shadow-md transition-all duration-300 ease-in-out' : ' top-0 bg-gray-800  p-2 transition-all duration-300 ease-in-out shadow-lg ']">
            <div class="flex gap-2 font-bold">

                <!-- <div class="flex-1">

                </div> -->
                <div class="flex justify-end w-[65%]">
                    <InputGroup>
                        <InputText placeholder="Search your notes" />
                        <Button>
                            <Icon icon="mingcute:search-line" />
                        </Button>
                    </InputGroup>
                </div>
                <div class="flex gap-2 w-[35%] justify-end">
                    <Dropdown v-model="selectedOrder" :options="orderOptions" optionLabel="label" class="w-full"
                        placeholder="Select">
                        <template #item="{ option }">
                            <div class="flex items-center gap-2">
                                <!-- Use the correct Iconify component with dynamic icon -->
                                <Icon :icon="option.icon" height="30" />
                                <span>{{ option.label }}</span>
                            </div>
                        </template>
                    </Dropdown>
                </div>
            </div>
        </div>
        <div class="col-span-12 flex gap-3 relative ">

            <div class=" bg-gray-900 min-h-screen">
                <div class="font-bold text-2xl p-3 ml-3">
                    History
                </div>
                <ul class="space-y-0  bg-gray-800">
                    <li v-for="(log, index) in logs" :key="index"
                        class="flex items-start space-x-4 px-4 py-2 bg-gray-800  shadow-lg transition-transform transform hsover:scale-105 hosver:bg-gray-600">
                        <!-- User Avatar -->
                        <div class="relative">
                            <Avatar :image="log.avatar" shape="circle" size="large"
                                class="border-2 border-gray-300 shadow-lg" />
                        </div>

                        <!-- Action Content -->
                        <div class="flex-1">
                            <p class="text-white text-lg font-medium">
                                <span class="font-semibold text-blue-600">{{ log.name }}</span> {{ log.action }}
                                <span class="font-semibold text-indigo-500">{{ log.item }}</span>
                            </p>
                            <p class="text-gray-500 text-sm">{{ log.time }}</p>
                        </div>

                        <!-- Icon with Circular Background -->
                        <div class="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                            <i :class="log.icon" class="text-indigo-600 text-xl"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

// Sample log data with avatars, actions, and icons
const logs = ref([
    { avatar: 'https://via.placeholder.com/40', name: 'John Doe', action: 'started cooking', item: 'Sizzling Hotdog', icon: 'pi pi-fire', time: '2 minutes ago' },
    { avatar: 'https://via.placeholder.com/40', name: 'Jane Doe', action: 'set the', item: 'Fried Chicken to unavailable', icon: 'pi pi-times', time: '5 minutes ago' },
    { avatar: 'https://via.placeholder.com/40', name: 'Mike Lee', action: 'restocked', item: 'Frozen Sausages', icon: 'pi pi-refresh', time: '10 minutes ago' },
    { avatar: 'https://via.placeholder.com/40', name: 'Emily Clark', action: 'removed', item: 'Grilled Cheese Sandwich from the menu', icon: 'pi pi-minus-circle', time: '15 minutes ago' },
    { avatar: 'https://via.placeholder.com/40', name: 'Sarah Brown', action: 'updated the price of', item: 'Chocolate Milkshake', icon: 'pi pi-dollar', time: '20 minutes ago' },
    { avatar: 'https://via.placeholder.com/40', name: 'David King', action: 'started preparing', item: 'Beef Steak', icon: 'pi pi-cutlery', time: '25 minutes ago' },
    { avatar: 'https://via.placeholder.com/40', name: 'Alice Green', action: 'marked', item: 'Spaghetti Carbonara as special', icon: 'pi pi-star', time: '30 minutes ago' },
    { avatar: 'https://via.placeholder.com/40', name: 'Paul White', action: 'updated the ingredients for', item: 'Vegetable Salad', icon: 'pi pi-pencil', time: '35 minutes ago' },
    { avatar: 'https://via.placeholder.com/40', name: 'Tom Black', action: 'started preparing', item: 'Garlic Bread', icon: 'pi pi-bread-slice', time: '40 minutes ago' },
    { avatar: 'https://via.placeholder.com/40', name: 'Anna Blue', action: 'added a new dish:', item: 'Mango Smoothie', icon: 'pi pi-plus', time: '45 minutes ago' },
    { avatar: 'https://via.placeholder.com/40', name: 'Lucy Gray', action: 'removed', item: 'Seafood Pasta from today\'s specials', icon: 'pi pi-trash', time: '50 minutes ago' },
    { avatar: 'https://via.placeholder.com/40', name: 'Ethan West', action: 'set the', item: 'Vegan Burger as available again', icon: 'pi pi-check', time: '55 minutes ago' },
    { avatar: 'https://via.placeholder.com/40', name: 'Isabel North', action: 'started cooking', item: 'Shrimp Tempura', icon: 'pi pi-egg', time: '1 hour ago' }
]);

const isRounded = ref(true); // State to manage if the topbar is rounded

const handleScroll = () => {
    // Change the shape based on the scroll position
    if (window.scrollY > 50) {
        isRounded.value = false;
    } else {
        isRounded.value = true;
    }
}; onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

const selectedOrder = ref({ label: 'All', icon: 'material-symbols-light:note-sharp' })

const orderOptions = [
    { label: 'All', icon: 'material-symbols-light:note-sharp' },
    { label: 'Menu', icon: 'material-symbols-light:note-sharp' },
    { label: 'Preparing', icon: 'material-symbols:restaurant' },
    { label: 'Pending', icon: 'material-symbols:pending-actions' },
    { label: 'Cancelled', icon: 'material-symbols:cancel' }
]


</script>

<style scoped>
/* Add some hover effect for better interaction */


/* Example additional styles if needed */
</style>