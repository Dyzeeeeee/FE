<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, watch } from 'vue';
const { toggleDarkMode, isDarkTheme } = useLayout();
const visibleCalendar = ref(false); // Added to control the calendar modal visibility

const visible = ref(false);
const selectedRoom = ref(null); // Holds the room for which the reservation is being made
const visibleReservations = ref(false); // Controls the visibility of the reservations modal
const reservations = ref([ // Example reservations data, replace with your dynamic data
    {
        id: 1,
        roomName: 'Event Hall',
        startDate: '2024-11-01',
        endDate: '2024-11-02',
        status: 'confirmed'
    },
    {
        id: 2,
        roomName: 'Swimming Pool',
        startDate: '2024-11-05',
        endDate: '2024-11-06',
        status: 'confirmed'
    }
]);

const openReservationModal = () => {
    visibleReservations.value = true; // Show the modal
};

const closeReservationModal = () => {
    visibleReservations.value = false; // Hide the modal
};
watch(visible, (newValue) => {
    if (newValue) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
});

const openCalendarModal = (room) => {
    selectedRoom.value = room; // Set the selected room
    visibleCalendar.value = true; // Show the calendar modal
};

// Handle the reservation process after selecting a date
const reserveRoom = (selectedDate) => {
    if (selectedDate.length === 2) {
        const [startDate, endDate] = selectedDate;

        // Function to format date as 'YYYY-MM-DD'
        const formatDate = (date) => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero to month
            const day = String(d.getDate()).padStart(2, '0'); // Add leading zero to day
            return `${year}-${month}-${day}`;
        };

        // Format the start and end dates
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        // Create a reservation object
        const reservation = {
            id: Date.now(), // Use timestamp as a unique ID
            roomId: selectedRoom.value.id,
            roomName: selectedRoom.value.name,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            status: 'confirmed',
        };

        // Add the reservation to the reservations array
        reservations.value.push(reservation);

        // Update room availability
        const room = rooms.value.find(room => room.id === selectedRoom.value.id);
        if (room) {
            room.available = false; // Mark the room as unavailable
        }

        // Close the calendar modal after the reservation is made
        visibleCalendar.value = false;

        // Log the reservation details (for demonstration)
        console.log('Reservation made:', reservation);
    } else {
        console.log('Please select a valid date range');
    }
};



const selectedDate = ref([]);

const rooms = ref([
    {
        id: 1,
        name: "Event Hall",
        description: "Perfect for conferences, parties, and small gatherings",
        rating: 7.8,
        reviews: 40,
        capacity: '50 people',
        price: 1500.00, // Rental price per session
        image: 'https://www.thepergola.net/uploads/4/2/7/7/4277785/nzr-1784_1_orig.jpg',
        available: true
    },
    {
        id: 2,
        name: "Swimming Pool",
        description: "Outdoor pool for swimming and relaxation",
        rating: 8.2,
        reviews: 90,
        capacity: '20 people',
        price: 500.00, // Per hour rental
        image: 'https://www.filbuild.com/b2b/ace_pools/assets/aong.jpg',
        available: true
    },
    {
        id: 3,
        name: "Karaoke Room",
        description: "Private room for singing with friends",
        rating: 7.5,
        reviews: 50,
        capacity: '8 people',
        price: 600.00, // Per hour rental
        image: 'https://s3-eu-west-1.amazonaws.com/prod-ecs-service-web-blog-media/2022/03/IMG_6704.jpg',
        available: true
    },
    {
        id: 4,
        name: "Conference Room",
        description: "Meeting room with projector and wifi",
        rating: 8.0,
        reviews: 35,
        capacity: '15 people',
        price: 800.00, // Per hour rental
        image: 'https://cdn-jdbmd.nitrocdn.com/yEMHtyTSADNOgebFqynalakIQNihDGqu/assets/images/optimized/rev-1cca927/www.officernd.com/wp-content/uploads/2024/05/word-image-33830-3.jpg',
        available: true
    },

    // Sleeping Quarters (Rooms)
    {
        id: 5,
        name: "Standard Room",
        description: "Comfortable room for a peaceful stay",
        rating: 7.0,
        reviews: 60,
        capacity: '1 bed',
        price: 800.00,
        image: 'https://en.hoteltheflag.jp/overview/rooms/img/sd/room01.jpg',
        available: true
    },
    {
        id: 6,
        name: "Economy Room",
        description: "Simple room for budget-friendly stays",
        rating: 6.5,
        reviews: 40,
        capacity: '1 bed',
        price: 600.00,
        image: 'https://www.queensangeles.com/media/k2/galleries/219/eco_01.jpg',
        available: true
    },
    {
        id: 7,
        name: "Twin Room",
        description: "Room with two beds, ideal for friends or family",
        rating: 7.2,
        reviews: 55,
        capacity: '2 beds',
        price: 1000.00,
        image: 'https://media.hotel7dublin.com/image/upload/f_auto,g_auto,c_auto,w_3840,q_auto/v1708601916/Uploads/Hotel7/Twin_Room_Hero_07817fcfab.jpg',
        available: true
    },
    {
        id: 8,
        name: "Deluxe Room",
        description: "Spacious room with additional amenities",
        rating: 7.8,
        reviews: 35,
        capacity: '2 beds',
        price: 1200.00,
        image: 'https://www.subicbaytravelershotel.com/wp-content/uploads/2020/06/20190603_170950-scaled.jpg',
        available: true
    },
    {
        id: 9,
        name: "Family Room",
        description: "Perfect for families with extra space and comfort",
        rating: 8.0,
        reviews: 50,
        capacity: '4 beds',
        price: 1500.00,
        image: 'https://www.decorilla.com/online-decorating/wp-content/uploads/2024/01/Contemporary-family-room-ideas-by-Decorilla_out-scaled.jpg',
        available: true
    },
    {
        id: 10,
        name: "Superior Room",
        description: "Larger room with extra features for relaxation",
        rating: 8.3,
        reviews: 65,
        capacity: '1 king bed',
        price: 1400.00,
        image: 'https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/125/2017/05/25024912/Rooms-Suites-Section-1st-Room-Superior-Room.jpg',
        available: true
    },
    {
        id: 11,
        name: "Budget Room",
        description: "Affordable and cozy for short stays",
        rating: 6.8,
        reviews: 30,
        capacity: '1 bed',
        price: 500.00,
        image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/0b/f3/67/room.jpg?w=700&h=-1&s=1',
        available: true
    },
    {
        id: 12,
        name: "Single Room",
        description: "Compact room for solo travelers",
        rating: 6.9,
        reviews: 45,
        capacity: '1 bed',
        price: 700.00,
        image: 'https://webbox.imgix.net/images/owvecfmxulwbfvxm/c56a0c0d-8454-431a-9b3e-f420c72e82e3.jpg?auto=format,compress&fit=crop&crop=entropy',
        available: true
    },
    {
        id: 13,
        name: "Couple's Room",
        description: "Cozy room for couples with extra comfort",
        rating: 7.6,
        reviews: 25,
        capacity: '1 bed',
        price: 950.00,
        image: 'https://hips.hearstapps.com/hmg-prod/images/bedroom-ideas-for-couples-080819-hb-taft-121-1663606868.jpg',
        available: true
    },
    {
        id: 14,
        name: "Luxury Room",
        description: "Luxurious room with all premium features",
        rating: 8.5,
        reviews: 70,
        capacity: '1 king bed',
        price: 2000.00,
        image: 'https://blog.floorcenter.com/wp-content/uploads/2021/04/4-Design-Ideas-for-A-Luxury-Bedroom.jpg',
        available: true
    },
    {
        id: 15,
        name: "Studio Room",
        description: "Room with a small kitchen for long stays",
        rating: 7.7,
        reviews: 80,
        capacity: '2 beds',
        price: 1300.00,
        image: 'https://www.propex.ai/blog/wp-content/uploads/2024/01/apartment-vs-Condonium-2-640x537-1.webp',
        available: true
    },
    {
        id: 16,
        name: "Poolside Room",
        description: "Room with direct access to the pool",
        rating: 8.1,
        reviews: 60,
        capacity: '1 bed',
        price: 1500.00,
        image: 'https://st.hzcdn.com/simgs/pictures/garden-sheds-and-buildings/contemporary-poolside-room-rooms-outdoor-img~1d3162660d28a29a_4-2072-1-63a6b6c.jpg',
        available: true
    },
    {
        id: 17,
        name: "Penthouse Suite",
        description: "Top-floor suite with panoramic views",
        rating: 8.9,
        reviews: 25,
        capacity: '3 beds',
        price: 2500.00,
        image: 'https://thealphasuites.com/wp-content/uploads/2023/01/Penthouse-Suite-Bedroom_3-scaled.jpg',
        available: true
    },
    {
        id: 18,
        name: "Garden Room",
        description: "Room with a private garden view",
        rating: 7.8,
        reviews: 40,
        capacity: '1 bed',
        price: 1100.00,
        image: 'https://www.greenretreats.co.uk/wp-content/uploads/contemporary-garden-rooms-scaled.jpg',
        available: true
    },
    {
        id: 19,
        name: "Ocean View Room",
        description: "Room with stunning views of the ocean",
        rating: 8.4,
        reviews: 30,
        capacity: '1 king bed',
        price: 1800.00,
        image: 'https://www.azurabermuda.com/wp-content/uploads/2023/02/Ocean-View-Guest-Room-1680x1120.jpg',
        available: true
    },
    {
        id: 20,
        name: "Balcony Room",
        description: "Room with a private balcony and outdoor seating",
        rating: 8.0,
        reviews: 50,
        capacity: '1 bed',
        price: 1300.00,
        image: 'https://static.dezeen.com/uploads/2020/06/royal-william-kaven-portland-oregon_dezeen_2364_col_2-1704x1150.jpg',
        available: true
    }
]);

// const reservations = ref([]);



const cancelReservation = (reservation) => {
    const index = reservations.value.findIndex(res => res.id === reservation.id);
    if (index !== -1) {
        reservations.value.splice(index, 1);
        const room = rooms.value.find(room => room.id === reservation.id);
        if (room) {
            room.available = true; // Mark the room as available again after cancellation
        }
    }
};
</script>

<template>
    <!-- <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
        <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
    </button> -->
    <div class="grid grid-cols-12 grid grid-cols-12 xl:gap-3 gap-1 -mx-5 xl:-mx-3">
        <div class="col-span-12">
            <div class="">
                <div class="text-2xl font-bold">
                    Reservations
                </div>
                <div class="grid grid-cols-12 xl:gap-4 gap-4 mt-5 pb-12 mb-12">
                    <div v-for="room in rooms" :key="room.id" class="col-span-12 lg:col-span-6 xl:col-span-4">
                        <div class="card p-0 h-auto mx-2 mb-4">
                            <div class="flex">
                                <img :src="room.image" class="object-cover xl:h-[20vh] h-auto w-1/3 rounded-lg" />
                                <div class="flex flex-col flex-1">
                                    <div class="p-4">
                                        <div class="text-xl font-bold xl:text-4xl">{{ room.name }}</div>
                                        <div class="text-sm italic xl:text-lg">{{ room.description }}</div>
                                        <div class="italic flex self-center">
                                            <Icon icon="mdi:star" width="20" height="20" class="text-yellow-500" />
                                            <div class="ml-1 font-normal">{{ room.rating }} • </div>
                                            <div class="ml-1 font-light">{{ room.reviews }} reviews</div>
                                        </div>
                                    </div>
                                    <div class="p-3 text-right">
                                        <div class="text-base xl:text-4xl"><span class="font-bold">Capacity:</span> {{
                                            room.capacity }}</div>
                                        <div class="text-base xl:text-lg">Price for 1 night and 2 adults</div>
                                        <div class="text-2xl xl:text-lg font-bold">₱{{ room.price.toFixed(2) }}</div>
                                    </div>
                                    <div class="p-3 text-right flex gap-2">
                                        <Button :outlined="!room.available" severity="info" class="w-full"
                                            @click="openCalendarModal(room)">
                                            <div class="font-bold">{{ room.available ? 'Reserve' : 'Booked' }}</div>
                                        </Button>
                                        <Button v-if="!room.available" class="w-full"
                                            @click="cancelReservation(reservations[reservations.length - 1])">
                                            <div class="font-bold">Cancel Reservation</div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="reservations.length" class="fixed bottom-12 right-7 transform mb-4">
                    <Button severity="info"
                        style="border-radius: 9999px; width: 13rem; height: auto; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top: 1rem; padding-bottom: 1rem;"
                        @click="openReservationModal">
                        <div class="flex flex-col items-center">
                            <div class="flex justify-center">
                                <Icon icon="mdi:queue" width="20" height="20" />
                                <span class="ml-1 font-bold">View Reservations</span>
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
        </div>

    </div>
    <Dialog v-model:visible="visibleCalendar" header="Select Reservation Date" :modal="true" :closable="false">
        <div class="flex justify-center">
            <Calendar v-model="selectedDate" :inline="true" showIcon="true" selectionMode="range" />
        </div>
        <div class="flex justify-center mt-3 gap-2">
            <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="visibleCalendar = false" />
            <Button label="Reserve" icon="pi pi-check" class="p-button-primary" @click="reserveRoom(selectedDate)" />
        </div>
    </Dialog>
    <Dialog v-model:visible="visibleReservations" header="Reservations" :modal="true" :closable="true"
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }">
        <div v-for="reservation in reservations" :key="reservation.id" class="mb-4">
            <div class="flex justify-between">
                <span>{{ reservation.roomName }}</span>
                <span>{{ reservation.startDate }} - {{ reservation.endDate }}</span>
            </div>
            <div class="text-sm text-gray-600">{{ reservation.status }}</div>
        </div>
        <template #footer>
            <Button label="Close" icon="pi pi-times" @click="closeReservationModal" class="p-button-text" />
        </template>
    </Dialog>

</template>

<style scoped>
.item-border {
    border: 2px solid #a7af4c;
    padding: 2px;
}
</style>
