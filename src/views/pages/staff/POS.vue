<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const visible = ref(false);
const sessionId = ref(null);  // This would be set based on your application logic
const sessions = ref([]);
const openingCash = ref(''); // This holds the value of the input for opening cash
const ordersBySession = ref({});


const getOrdersBySession = async (sessionId) => {
    try {
        const response = await axios.get(`/get-orders/${sessionId}`);
        ordersBySession.value[sessionId] = response.data;
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        ordersBySession.value[sessionId] = [];
    }
};
const continueToSell = (sessionId) => {
    router.push(`/Staff/POS/Sell/${sessionId}`);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};





// Function to fetch sessions from your backend using Axios
const getSessions = async () => {
    try {
        const response = await axios.get('/get-sessions');
        const userId = sessionStorage.getItem('userId');  // Retrieve userId from sessionStorage
        if (response.data && Array.isArray(response.data)) {
            // Filter sessions to only include those that belong to the current userId
            const filteredSessions = response.data.filter(session => session.cashier_id === userId);
            // Sort these filtered sessions by id in descending order
            sessions.value = filteredSessions.sort((a, b) => b.id - a.id);
        } else {
            sessions.value = []; // Ensures sessions is always an array, even on error or empty data
        }
        console.log(sessions.value);  // Log the filtered and sorted sessions for debugging
    } catch (error) {
        console.error('Failed to fetch sessions:', error);
    }
};



// Example function to add a session
// Example function to add a session
const startSession = async () => {
    // Check if there is any session that is still open
    if (sessions.value.some(session => session.status === 'open')) {
        alert('A session is still open. Please close it before starting a new one.');
        return;  // Stop the function execution if an open session is found
    }

    const userId = sessionStorage.getItem('userId'); // Retrieve the user ID
    localStorage.setItem('opening_cash', openingCash.value); // Store the opening cash in localStorage
    console.log(openingCash.value);

    try {
        const sessionData = {
            cashier_id: userId,
            opening_cash: openingCash.value,
            status: 'open'
        };

        const response = await axios.post('/add-session', sessionData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Including the JWT token for authorization
            }
        });

        console.log('Session added:', response.data);
        visible.value = false;  // Close the dialog

        if (response.data && response.data.id) {
            sessionId.value = response.data.id;  // Store the new session ID
            router.push(`/Staff/POS/Sell/${sessionId.value}`);  // Navigate to the selling page
        } else {
            console.error("Failed to retrieve session ID from response");
        }
    } catch (error) {
        console.error('Failed to add session:', error);
    }
};




onMounted(() => {
    getSessions();
});

</script>


<template>
    <div class="grid grid-cols-12 gap-3 -m-3">
        <div class="col-span-12 lg:col-span-6 xl:col-span-12 xl:m-0 h-[80vh] flex flex-col justify-between ">
            <!-- Your Cards Section -->
            <div class="grid grid-cols-12 gap-2 xl:pb-7 pb-20">
                <div class="col-span-12 xl:flex hidden justify-between items-center mb-4">
                    <div class="flex-grow flex gap-2">
                        <Button size="small">
                            <Icon icon="uiw:filter" width="20" height="20" />
                        </Button>
                        <IconField iconPosition="left">
                            <InputIcon>
                                <i class="pi pi-search"></i>
                            </InputIcon>
                            <InputText v-model="searchTerm" placeholder="Search..." class="w-full"
                                style="width: 30rem;" />
                        </IconField>
                        <Button size="small">
                            <Icon icon="cil:list" width="20" height="20" />
                        </Button>
                    </div>
                    <Button class="w-auto ml-4" severity="success" style="height: 3rem; width: 15rem;"
                        @click="visible = true">
                        <Icon icon="hugeicons:cashier" width="20" height="20" />
                        <div class="font-bold sm:block">Start Selling</div>
                    </Button>
                </div>
                <div class="col-span-12 sm:col-span-6 xl:col-span-4" v-for="session in sessions" :key="session.id">
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 h-[23vh] xl:min-h-[20vh] xl:h-auto m-0 flex flex-col justify-between p-4">
                        <div>
                            <div class="text-xl font-bold flex justify-between pb-3">
                                <div class="self-center">{{ formatDate(session.start_time) }}</div>
                                <div class="flex gap-1" v-if="session.status !== 'closed'">
                                    <!-- <Button size="small" style="height: 30px; width: auto" severity="danger"
                                        @click="endSession(session.id)">
                                        <Icon icon="material-symbols:tab-close-outline" width="20" height="20" />
                                        <div>End</div>
                                    </Button> -->

                                    <Button @click="continueToSell(session.id)" size="small"
                                        style="height: 30px; width: auto">
                                        <Icon icon="bitcoin-icons:cart-filled" width="20" height="20" />
                                        <div>Continue</div>
                                    </Button>
                                </div>
                            </div>

                            <div class="flex justify-between items-center text-sm px-1">
                                <div class="flex items-center">
                                    <div class="text-green-600 font-bold">Opened:</div>
                                    <div>&nbsp;{{ formatTime(session.start_time) }}</div>
                                </div>
                                <div><span class="font-bold">Starting:&nbsp;</span>₱{{ session.opening_cash }}</div>
                            </div>
                            <div class="flex justify-between items-center text-sm px-1">
                                <div class="flex items-center">
                                    <div class="text-red-400 font-bold">Closed:</div>
                                    <div>&nbsp;{{ session.end_time ? formatTime(session.end_time) : 'Still Open' }}
                                    </div>

                                </div>
                                <div class="text-xl "><span class="font-bold">Total:&nbsp;</span>₱{{
                                    session.total_cash }}</div>
                                <!-- Example Total -->
                            </div>
                            <div class="flex justify-end mt-4 w-full gap-2">
                                <!-- <Button class="w-1/2" severity="danger" outlined>End Session</Button> -->
                                <!-- <Button class="w-full" severity="success"
                                    @click="continueToSell(session.id)">Continue</Button> -->
                            </div>

                        </div>
                        <div class="pt-8 " style="margin: -14px;">
                            <Accordion value="0">
                                <AccordionPanel value="1" @click="() => getOrdersBySession(session.id)">
                                    <AccordionHeader :pt="{
                                        root: {
                                            class: 'border-none',
                                            style: 'background-color: #485c74;' // Example additional root style
                                        },
                                    }">Details</AccordionHeader>
                                    <AccordionContent :pt="{
                                        root: {
                                            class: 'border-none',
                                            style: 'max-height: 400px; overflow: auto;' // Adding overflow auto for scrollable content
                                        },
                                    }">
                                        <DataTable :value="ordersBySession[session.id]"
                                            v-if="ordersBySession[session.id] && ordersBySession[session.id].length">
                                            <Column field="id" header="Order ID"></Column>
                                            <!-- <Column field="customer_id" header="Customer"></Column> -->
                                            <Column field="order_date" header="Date">
                                                <template #body="slotProps">
                                                    {{ formatTime(slotProps.data.order_date) }}
                                                </template>
                                            </Column>
                                            <Column field="total_price" header="Total"></Column>
                                            <Column field="status" header="Status"></Column>
                                        </DataTable>
                                        <div v-else>No orders to display</div>
                                    </AccordionContent>
                                </AccordionPanel>
                            </Accordion>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Start Selling Button at the Bottom -->
            <div class="flex w-full fixed justify-center bottom-0 left-1/2 transform -translate-x-1/2 mb-1 xl:hidden">
                <Button class="w-10/12" severity="success" style="height: 4rem;" @click="visible = true">
                    <Icon icon="hugeicons:cashier" width="20" height="20" />
                    <div class="font-bold sm:block">Start Selling</div>
                </Button>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visible" modal header="Start Session" :style="{ width: '25rem' }">
        <div class="flex items-center gap-4 mb-4">
            <label for="openingCash" class="font-semibold w-24">Starting Cash</label>
            <InputText id="openingCash" v-model="openingCash" class="flex-auto" autocomplete="off"
                placeholder="Enter opening cash" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
            <Button type="button" @click="startSession" label="Start" style="width: 9rem;"></Button>
        </div>
    </Dialog>

</template>

<style>
.item-border {
    border: 2px solid #a7af4c;
    padding: 2px;
}

:root {
    /* --p-accordion-content-background: #4CAF50; */
    /* Change to your preferred color */
}
</style>
