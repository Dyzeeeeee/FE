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
                    <!-- <Button class="w-auto ml-4" severity="success" style="height: 3rem; width: 15rem;"
                        @click="visible = true">
                        <Icon icon="hugeicons:cashier" width="20" height="20" />
                        <div class="font-bold sm:block">Start Selling</div>
                    </Button> -->
                </div>
                <div class="col-span-12">
                    <Divider align="center">
                        <b class="text-green-500">Done</b>
                    </Divider>
                </div>
                <div class="col-span-12 sm:col-span-6 xl:col-span-6">
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 h-auto  xl:min-h-[20vh] xl:h-auto m-0 flex flex-col justify-between p-4 relative">
                        <div>
                            <div class="text-xl font-bold flex justify-between pb-3">
                                <div class="flex self-center">
                                    <div class="pr-2">
                                        <Checkbox v-model="checked" :binary="true" disabled />
                                    </div>
                                    <div>
                                        <Icon icon="cbi:garbage-residual" width="20" height="20" />
                                    </div>
                                    <div>
                                        Take out the Trash and Take it back ihahahah
                                    </div>
                                </div>
                            </div>
                            <div class="flex ">
                                <div>
                                    <!-- Fix the overflow issue with truncate and ellipsis -->
                                    <div class="text-sm italic pb-0 mb-2 w-full cursor-pointer text-yellow-100 overflow-hidden"
                                        style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                        Details Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
                                        nostrum saepe beatae commodi mollitia perferendis distinctio similique
                                        voluptate sint iusto inventore doloremque veniam rem, officia expedita,
                                        dignissimos
                                        recusandae eligendi corrupti!
                                    </div>


                                    <div class=" flex items-center text-sm px-1 mb-5 pb-1">
                                        <div class="flex-wrap items-center">
                                            <div class="font-bold">Assigned to:</div>
                                            <div class="flex">
                                                <div class="flex-wrap text-center pt-2">
                                                    <Avatar
                                                        image="https://static.vecteezy.com/system/resources/previews/017/189/658/original/cute-cartoon-fox-funny-red-fox-for-collection-emotion-little-animal-cartoon-animal-character-design-flat-illustration-isolated-on-white-background-adorable-cute-illustration-clean-design-free-vector.jpg"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Jan Dyze Malaluan'" />
                                                    <Avatar
                                                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBb-FCsrzC3isolTz2qVfsod_B8wDf-6bGDw&s"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Julie Anne Ramirez'" />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div class="flex items-center">
                                            <div class="font-bold">Given:</div>
                                            <div>&nbsp;Sept. 20 (8:59pm)</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div><span class="font-bold">Due:&nbsp;</span>Sept. 22 (5:00pm)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Button positioned at the bottom right -->
                        <div class="font-bold gap-1 flex justify-end mt-4 absolute bottom-4 right-4">
                            <Button>
                                <Icon icon="hugeicons:task-01" height="20" width="20" />
                                Take Task
                            </Button>
                        </div>
                    </div>




                </div>

                <div class="col-span-12 sm:col-span-6 xl:col-span-6">
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 h-auto  xl:min-h-[20vh] xl:h-auto m-0 flex flex-col justify-between p-4 relative">
                        <div>
                            <div class="text-xl font-bold flex justify-between pb-3">
                                <div class="flex self-center">
                                    <div class="pr-2">
                                        <Checkbox v-model="checked" :binary="true" disabled />
                                    </div>
                                    <div>
                                        <Icon icon="cbi:garbage-residual" width="20" height="20" />
                                    </div>
                                    <div>
                                        Take out the Trash and Take it back ihahahah
                                    </div>
                                </div>
                            </div>
                            <div class="flex ">
                                <div>
                                    <!-- Fix the overflow issue with truncate and ellipsis -->
                                    <div class="text-sm italic pb-0 mb-2 w-full cursor-pointer text-yellow-100 overflow-hidden"
                                        style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                        Details Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
                                        nostrum saepe beatae commodi mollitia perferendis distinctio similique
                                        voluptate sint iusto inventore doloremque veniam rem, officia expedita,
                                        dignissimos
                                        recusandae eligendi corrupti!
                                    </div>


                                    <div class=" flex items-center text-sm px-1 mb-5 pb-1">
                                        <div class="flex-wrap items-center">
                                            <div class="font-bold">Assigned to:</div>
                                            <div class="flex">
                                                <div class="flex-wrap text-center pt-2">
                                                    <Avatar
                                                        image="https://static.vecteezy.com/system/resources/previews/017/189/658/original/cute-cartoon-fox-funny-red-fox-for-collection-emotion-little-animal-cartoon-animal-character-design-flat-illustration-isolated-on-white-background-adorable-cute-illustration-clean-design-free-vector.jpg"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Jan Dyze Malaluan'" />
                                                    <Avatar
                                                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBb-FCsrzC3isolTz2qVfsod_B8wDf-6bGDw&s"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Julie Anne Ramirez'" />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div class="flex items-center">
                                            <div class="font-bold">Given:</div>
                                            <div>&nbsp;Sept. 20 (8:59pm)</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div><span class="font-bold">Due:&nbsp;</span>Sept. 22 (5:00pm)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Button positioned at the bottom right -->
                        <div class="font-bold gap-1 flex justify-end mt-4 absolute bottom-4 right-4">
                            <Button>
                                <Icon icon="hugeicons:task-01" height="20" width="20" />
                                Take Task
                            </Button>
                        </div>
                    </div>


                </div>
                <div class="col-span-12">
                    <Divider align="center">
                        <b class="text-yellow-500">New</b>
                    </Divider>
                </div>
                <div class="col-span-12 sm:col-span-6 xl:col-span-6">
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 h-auto  xl:min-h-[20vh] xl:h-auto m-0 flex flex-col justify-between p-4 relative">
                        <div>
                            <div class="text-xl font-bold flex justify-between pb-3">
                                <div class="flex self-center">
                                    <div class="pr-2">
                                        <Checkbox v-model="checked" :binary="true" disabled />
                                    </div>
                                    <div>
                                        <Icon icon="cbi:garbage-residual" width="20" height="20" />
                                    </div>
                                    <div>
                                        Take out the Trash and Take it back ihahahah
                                    </div>
                                </div>
                            </div>
                            <div class="flex ">
                                <div>
                                    <!-- Fix the overflow issue with truncate and ellipsis -->
                                    <div class="text-sm italic pb-0 mb-2 w-full cursor-pointer text-yellow-100 overflow-hidden"
                                        style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                        Details Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
                                        nostrum saepe beatae commodi mollitia perferendis distinctio similique
                                        voluptate sint iusto inventore doloremque veniam rem, officia expedita,
                                        dignissimos
                                        recusandae eligendi corrupti!
                                    </div>


                                    <div class=" flex items-center text-sm px-1 mb-5 pb-1">
                                        <div class="flex-wrap items-center">
                                            <div class="font-bold">Assigned to:</div>
                                            <div class="flex">
                                                <div class="flex-wrap text-center pt-2">
                                                    <Avatar
                                                        image="https://static.vecteezy.com/system/resources/previews/017/189/658/original/cute-cartoon-fox-funny-red-fox-for-collection-emotion-little-animal-cartoon-animal-character-design-flat-illustration-isolated-on-white-background-adorable-cute-illustration-clean-design-free-vector.jpg"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Jan Dyze Malaluan'" />
                                                    <Avatar
                                                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBb-FCsrzC3isolTz2qVfsod_B8wDf-6bGDw&s"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Julie Anne Ramirez'" />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div class="flex items-center">
                                            <div class="font-bold">Given:</div>
                                            <div>&nbsp;Sept. 20 (8:59pm)</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div><span class="font-bold">Due:&nbsp;</span>Sept. 22 (5:00pm)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Button positioned at the bottom right -->
                        <div class="font-bold gap-1 flex justify-end mt-4 absolute bottom-4 right-4">
                            <Button>
                                <Icon icon="hugeicons:task-01" height="20" width="20" />
                                Take Task
                            </Button>
                        </div>
                    </div>


                </div>

                <div class="col-span-12 sm:col-span-6 xl:col-span-6">
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 h-auto  xl:min-h-[20vh] xl:h-auto m-0 flex flex-col justify-between p-4 relative">
                        <div>
                            <div class="text-xl font-bold flex justify-between pb-3">
                                <div class="flex self-center">
                                    <div class="pr-2">
                                        <Checkbox v-model="checked" :binary="true" disabled />
                                    </div>
                                    <div>
                                        <Icon icon="cbi:garbage-residual" width="20" height="20" />
                                    </div>
                                    <div>
                                        Take out the Trash and Take it back ihahahah
                                    </div>
                                </div>
                            </div>
                            <div class="flex ">
                                <div>
                                    <!-- Fix the overflow issue with truncate and ellipsis -->
                                    <div class="text-sm italic pb-0 mb-2 w-full cursor-pointer text-yellow-100 overflow-hidden"
                                        style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                        Details Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
                                        nostrum saepe beatae commodi mollitia perferendis distinctio similique
                                        voluptate sint iusto inventore doloremque veniam rem, officia expedita,
                                        dignissimos
                                        recusandae eligendi corrupti!
                                    </div>


                                    <div class=" flex items-center text-sm px-1 mb-5 pb-1">
                                        <div class="flex-wrap items-center">
                                            <div class="font-bold">Assigned to:</div>
                                            <div class="flex">
                                                <div class="flex-wrap text-center pt-2">
                                                    <Avatar
                                                        image="https://static.vecteezy.com/system/resources/previews/017/189/658/original/cute-cartoon-fox-funny-red-fox-for-collection-emotion-little-animal-cartoon-animal-character-design-flat-illustration-isolated-on-white-background-adorable-cute-illustration-clean-design-free-vector.jpg"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Jan Dyze Malaluan'" />
                                                    <Avatar
                                                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBb-FCsrzC3isolTz2qVfsod_B8wDf-6bGDw&s"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Julie Anne Ramirez'" />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div class="flex items-center">
                                            <div class="font-bold">Given:</div>
                                            <div>&nbsp;Sept. 20 (8:59pm)</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div><span class="font-bold">Due:&nbsp;</span>Sept. 22 (5:00pm)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Button positioned at the bottom right -->
                        <div class="font-bold gap-1 flex justify-end mt-4 absolute bottom-4 right-4">
                            <Button>
                                <Icon icon="hugeicons:task-01" height="20" width="20" />
                                Take Task
                            </Button>
                        </div>
                    </div>


                </div>
                <div class="col-span-12">
                    <Divider align="center">
                        <b class="text-red-500">Overdue</b>
                    </Divider>
                </div>
                <div class="col-span-12 sm:col-span-6 xl:col-span-6">
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 h-auto  xl:min-h-[20vh] xl:h-auto m-0 flex flex-col justify-between p-4 relative">
                        <div>
                            <div class="text-xl font-bold flex justify-between pb-3">
                                <div class="flex self-center">
                                    <div class="pr-2">
                                        <Checkbox v-model="checked" :binary="true" disabled />
                                    </div>
                                    <div>
                                        <Icon icon="cbi:garbage-residual" width="20" height="20" />
                                    </div>
                                    <div>
                                        Take out the Trash and Take it back ihahahah
                                    </div>
                                </div>
                            </div>
                            <div class="flex ">
                                <div>
                                    <!-- Fix the overflow issue with truncate and ellipsis -->
                                    <div class="text-sm italic pb-0 mb-2 w-full cursor-pointer text-yellow-100 overflow-hidden"
                                        style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                        Details Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
                                        nostrum saepe beatae commodi mollitia perferendis distinctio similique
                                        voluptate sint iusto inventore doloremque veniam rem, officia expedita,
                                        dignissimos
                                        recusandae eligendi corrupti!
                                    </div>


                                    <div class=" flex items-center text-sm px-1 mb-5 pb-1">
                                        <div class="flex-wrap items-center">
                                            <div class="font-bold">Assigned to:</div>
                                            <div class="flex">
                                                <div class="flex-wrap text-center pt-2">
                                                    <Avatar
                                                        image="https://static.vecteezy.com/system/resources/previews/017/189/658/original/cute-cartoon-fox-funny-red-fox-for-collection-emotion-little-animal-cartoon-animal-character-design-flat-illustration-isolated-on-white-background-adorable-cute-illustration-clean-design-free-vector.jpg"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Jan Dyze Malaluan'" />
                                                    <Avatar
                                                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBb-FCsrzC3isolTz2qVfsod_B8wDf-6bGDw&s"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Julie Anne Ramirez'" />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div class="flex items-center">
                                            <div class="font-bold">Given:</div>
                                            <div>&nbsp;Sept. 20 (8:59pm)</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div><span class="font-bold">Due:&nbsp;</span>Sept. 22 (5:00pm)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Button positioned at the bottom right -->
                        <div class="font-bold gap-1 flex justify-end mt-4 absolute bottom-4 right-4">
                            <Button>
                                <Icon icon="hugeicons:task-01" height="20" width="20" />
                                Take Task
                            </Button>
                        </div>
                    </div>




                </div>

                <div class="col-span-12 sm:col-span-6 xl:col-span-6">
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 h-auto  xl:min-h-[20vh] xl:h-auto m-0 flex flex-col justify-between p-4 relative">
                        <div>
                            <div class="text-xl font-bold flex justify-between pb-3">
                                <div class="flex self-center">
                                    <div class="pr-2">
                                        <Checkbox v-model="checked" :binary="true" disabled />
                                    </div>
                                    <div>
                                        <Icon icon="cbi:garbage-residual" width="20" height="20" />
                                    </div>
                                    <div>
                                        Take out the Trash and Take it back ihahahah
                                    </div>
                                </div>
                            </div>
                            <div class="flex ">
                                <div>
                                    <!-- Fix the overflow issue with truncate and ellipsis -->
                                    <div class="text-sm italic pb-0 mb-2 w-full cursor-pointer text-yellow-100 overflow-hidden"
                                        style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                        Details Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
                                        nostrum saepe beatae commodi mollitia perferendis distinctio similique
                                        voluptate sint iusto inventore doloremque veniam rem, officia expedita,
                                        dignissimos
                                        recusandae eligendi corrupti!
                                    </div>


                                    <div class=" flex items-center text-sm px-1 mb-5 pb-1">
                                        <div class="flex-wrap items-center">
                                            <div class="font-bold">Assigned to:</div>
                                            <div class="flex">
                                                <div class="flex-wrap text-center pt-2">
                                                    <Avatar
                                                        image="https://static.vecteezy.com/system/resources/previews/017/189/658/original/cute-cartoon-fox-funny-red-fox-for-collection-emotion-little-animal-cartoon-animal-character-design-flat-illustration-isolated-on-white-background-adorable-cute-illustration-clean-design-free-vector.jpg"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Jan Dyze Malaluan'" />
                                                    <Avatar
                                                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBb-FCsrzC3isolTz2qVfsod_B8wDf-6bGDw&s"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Julie Anne Ramirez'" />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div class="flex items-center">
                                            <div class="font-bold">Given:</div>
                                            <div>&nbsp;Sept. 20 (8:59pm)</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div><span class="font-bold">Due:&nbsp;</span>Sept. 22 (5:00pm)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Button positioned at the bottom right -->
                        <div class="font-bold gap-1 flex justify-end mt-4 absolute bottom-4 right-4">
                            <Button>
                                <Icon icon="hugeicons:task-01" height="20" width="20" />
                                Take Task
                            </Button>
                        </div>
                    </div>


                </div>
                <div class="col-span-12">
                    <Divider align="center">
                        <b class="text-orange-500">Not Done</b>
                    </Divider>
                </div>
                <div class="col-span-12 sm:col-span-6 xl:col-span-6">
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 h-auto  xl:min-h-[20vh] xl:h-auto m-0 flex flex-col justify-between p-4 relative">
                        <div>
                            <div class="text-xl font-bold flex justify-between pb-3">
                                <div class="flex self-center">
                                    <div class="pr-2">
                                        <Checkbox v-model="checked" :binary="true" disabled />
                                    </div>
                                    <div>
                                        <Icon icon="cbi:garbage-residual" width="20" height="20" />
                                    </div>
                                    <div>
                                        Take out the Trash and Take it back ihahahah
                                    </div>
                                </div>
                            </div>
                            <div class="flex ">
                                <div>
                                    <!-- Fix the overflow issue with truncate and ellipsis -->
                                    <div class="text-sm italic pb-0 mb-2 w-full cursor-pointer text-yellow-100 overflow-hidden"
                                        style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                        Details Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
                                        nostrum saepe beatae commodi mollitia perferendis distinctio similique
                                        voluptate sint iusto inventore doloremque veniam rem, officia expedita,
                                        dignissimos
                                        recusandae eligendi corrupti!
                                    </div>


                                    <div class=" flex items-center text-sm px-1 mb-5 pb-1">
                                        <div class="flex-wrap items-center">
                                            <div class="font-bold">Assigned to:</div>
                                            <div class="flex">
                                                <div class="flex-wrap text-center pt-2">
                                                    <Avatar
                                                        image="https://static.vecteezy.com/system/resources/previews/017/189/658/original/cute-cartoon-fox-funny-red-fox-for-collection-emotion-little-animal-cartoon-animal-character-design-flat-illustration-isolated-on-white-background-adorable-cute-illustration-clean-design-free-vector.jpg"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Jan Dyze Malaluan'" />
                                                    <Avatar
                                                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBb-FCsrzC3isolTz2qVfsod_B8wDf-6bGDw&s"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Julie Anne Ramirez'" />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div class="flex items-center">
                                            <div class="font-bold">Given:</div>
                                            <div>&nbsp;Sept. 20 (8:59pm)</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div><span class="font-bold">Due:&nbsp;</span>Sept. 22 (5:00pm)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Button positioned at the bottom right -->
                        <div class="font-bold gap-1 flex justify-end mt-4 absolute bottom-4 right-4">
                            <Button>
                                <Icon icon="hugeicons:task-01" height="20" width="20" />
                                Take Task
                            </Button>
                        </div>
                    </div>




                </div>

                <div class="col-span-12 sm:col-span-6 xl:col-span-6">
                    <div
                        class="card bg-surface-200 dark:bg-surface-800 h-auto  xl:min-h-[20vh] xl:h-auto m-0 flex flex-col justify-between p-4 relative">
                        <div>
                            <div class="text-xl font-bold flex justify-between pb-3">
                                <div class="flex self-center">
                                    <div class="pr-2">
                                        <Checkbox v-model="checked" :binary="true" disabled />
                                    </div>
                                    <div>
                                        <Icon icon="cbi:garbage-residual" width="20" height="20" />
                                    </div>
                                    <div>
                                        Take out the Trash and Take it back ihahahah
                                    </div>
                                </div>
                            </div>
                            <div class="flex ">
                                <div>
                                    <!-- Fix the overflow issue with truncate and ellipsis -->
                                    <div class="text-sm italic pb-0 mb-2 w-full cursor-pointer text-yellow-100 overflow-hidden"
                                        style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                        Details Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
                                        nostrum saepe beatae commodi mollitia perferendis distinctio similique
                                        voluptate sint iusto inventore doloremque veniam rem, officia expedita,
                                        dignissimos
                                        recusandae eligendi corrupti!
                                    </div>


                                    <div class=" flex items-center text-sm px-1 mb-5 pb-1">
                                        <div class="flex-wrap items-center">
                                            <div class="font-bold">Assigned to:</div>
                                            <div class="flex">
                                                <div class="flex-wrap text-center pt-2">
                                                    <Avatar
                                                        image="https://static.vecteezy.com/system/resources/previews/017/189/658/original/cute-cartoon-fox-funny-red-fox-for-collection-emotion-little-animal-cartoon-animal-character-design-flat-illustration-isolated-on-white-background-adorable-cute-illustration-clean-design-free-vector.jpg"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Jan Dyze Malaluan'" />
                                                    <Avatar
                                                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBb-FCsrzC3isolTz2qVfsod_B8wDf-6bGDw&s"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Julie Anne Ramirez'" />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div class="flex items-center">
                                            <div class="font-bold">Given:</div>
                                            <div>&nbsp;Sept. 20 (8:59pm)</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center text-sm px-1">
                                        <div><span class="font-bold">Due:&nbsp;</span>Sept. 22 (5:00pm)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Button positioned at the bottom right -->
                        <div class="font-bold gap-1 flex justify-end mt-4 absolute bottom-4 right-4">
                            <Button>
                                <Icon icon="hugeicons:task-01" height="20" width="20" />
                                Take Task
                            </Button>
                        </div>
                    </div>


                </div>

            </div>
        </div>
    </div>


</template>

<style>
.item-border {
    border: 2px solid #a7af4c;
    padding: 2px;
}
</style>
