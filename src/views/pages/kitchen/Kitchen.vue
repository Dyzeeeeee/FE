    <script setup>
    import axios from 'axios';
    import { useToast } from 'primevue/usetoast';
    import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

    const toast = useToast();
    const visible = ref(false);
    const previousOrders = ref(false);
    const initialLoadCompleted = ref(false); // State to track if initial load is done

    const orders = ref([]);  // Reactive property to store the orders
    const getOrders = async () => {
        try {
            const response = await axios.get('/get-orders');
            if (response.data) {
                orders.value = response.data;  // Store fetched orders in the reactive property
            } else {
                console.error('No orders returned from the server');
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };



    // Watch for changes in order statuses, specifically for 'cancelled' status
    watch(
        () => orders.value.map(order => order.details.map(detail => detail.status)),
        (newStatuses, oldStatuses) => {
            newStatuses.forEach((orderStatuses, orderIndex) => {
                orderStatuses.forEach((status, detailIndex) => {
                    if (status === 'cancelled' && oldStatuses[orderIndex][detailIndex] !== 'cancelled') {
                        console.log(`Order ${orders.value[orderIndex].id}, Detail ${orders.value[orderIndex].details[detailIndex].detail_id} status changed to cancelled.`);
                    }
                });
            });
        },
        { deep: true }  // Use deep to watch for changes in nested properties
    );

    // Computed property to filter out orders with all details 'serving'
    const activeOrders = computed(() => {
        return orders.value.filter(order => {
            // Exclude orders with 'cancelled' status
            return order.status !== 'cancelled' &&
                order.details.some(detail => detail.status !== 'serving');
        });
    });



    const updateOrderStatus = async (order, detail) => {
        // Toggle the status based on current value
        detail.status = detail.status === 'preparing' ? 'serving' : 'preparing';

        try {
            // Send the updated status to the backend
            const response = await axios.post('/update-order-status', {
                detailId: detail.detail_id,
                newStatus: detail.status
            });

            if (response.data.success) {
                console.log('Status updated successfully');
            } else {
                console.error('Failed to update status');
                // Revert the status change if the update fails
                detail.status = detail.status === 'preparing' ? 'serving' : 'preparing';
            }
        } catch (error) {
            console.error('Error updating status:', error);
            // Revert the status change if there is an error
            detail.status = detail.status === 'preparing' ? 'serving' : 'preparing';
        }
    };


    const ordersColumn1 = computed(() => orders.value.filter((_, index) => index % 3 === 0));
    const ordersColumn2 = computed(() => orders.value.filter((_, index) => index % 3 === 1));
    const ordersColumn3 = computed(() => orders.value.filter((_, index) => index % 3 === 2));



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

    const ordersSummary = computed(() => {
        const summary = {};
        orders.value.forEach(order => {
            if (order.status !== 'cancelled') {  // Exclude cancelled orders entirely
                order.details.forEach(detail => {
                    // Also check if the detail itself isn't cancelled
                    if (detail.status !== 'cancelled' && detail.status === 'preparing') {
                        const categoryName = detail.category_name;
                        const menuName = detail.menu_name;
                        const quantity = parseInt(detail.quantity);

                        if (!summary[categoryName]) {
                            summary[categoryName] = { totalQuantity: 0, items: {} };
                        }

                        summary[categoryName].totalQuantity += quantity;

                        if (!summary[categoryName].items[menuName]) {
                            summary[categoryName].items[menuName] = 0;
                        }
                        summary[categoryName].items[menuName] += quantity;
                    }
                });
            }
        });
        return summary;
    });



    onMounted(async () => {
        await getOrders();  // Fetch orders on mount
        initialLoadCompleted.value = false; // Reset the flag on each mount
        const intervalId = setInterval(getOrders, 10000); // Polling interval
        onUnmounted(() => clearInterval(intervalId));
    });


    watch(
        () => orders.value.map(order => ({
            id: order.id,
            status: order.status,
            detailsCount: order.details.length
        })),
        (newOrders, oldOrders) => {
            if (!initialLoadCompleted.value) {
                initialLoadCompleted.value = true;
                return;
            }

            // Detect if new orders have been added
            const newOrdersCount = newOrders.length - oldOrders.length;
            if (newOrdersCount > 0) {
                const addedOrders = newOrders.slice(oldOrders.length);
                addedOrders.forEach(order => {
                    if (order.detailsCount > 1) { // More than one detail in the new order
                        toast.add({
                            severity: 'success',
                            summary: 'New Order Added',
                            detail: `Order #${order.id} with ${order.detailsCount} items has been added.`,
                            life: 3000
                        });
                    } else { // Exactly one detail in the new order
                        toast.add({
                            severity: 'success',
                            summary: 'New Order Added',
                            detail: `Order #${order.id} with one item has been added.`,
                            life: 3000
                        });
                    }
                });
            }

            // Handle changes in existing orders
            newOrders.forEach((newOrder, index) => {
                const oldOrder = oldOrders[index];
                if (oldOrder && newOrder.status === 'cancelled' && oldOrder.status !== 'cancelled') {
                    toast.add({
                        severity: 'warn',
                        summary: 'Order Cancelled',
                        detail: `Order #${newOrder.id} has been cancelled.`,
                        life: 3000
                    });
                }
            });
        },
        { deep: true }
    );







</script>


    <template>
        <Toast />
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
                        <Button class="w-auto ml-4" severity="info" style="height: 3rem; width: 15rem;"
                            @click="previousOrders = true">
                            <Icon icon="fluent-mdl2:activate-orders" width="20" height="20" />
                            <div class="font-bold sm:block">Previous Orders</div>
                        </Button>
                    </div>



                    <div class="col-span-12 xl:col-span-3">
                        <div
                            class="card bg-surface-200 dark:bg-surface-700 m-0 flex flex-col justify-start p-0  h-auto min-h-[78vh]">
                            <div class="font-bold p-2 text-3xl bg-neutral-500 rounded-t-md">Orders Summary</div>
                            <div v-for="(data, category) in ordersSummary" :key="category">
                                <div class="bg-slate-700 text-xl p-2 text-center">{{ category }}</div>
                                <div v-for="(qty, itemName) in data.items" :key="itemName"
                                    class="text-xl py-1 px-3 flex justify-between">
                                    <div class="self-center ml-5">{{ itemName }}</div>
                                    <div class="mr-5 bg-gray-500 py-1 px-3 rounded-md text-sm">{{ qty }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                        <transition-group name="fade" tag="div">

                            <div class="flex flex-col gap-y-2 mb-2"
                                v-for="order in activeOrders.filter((_, index) => index % 3 === 0)" :key="order.id">

                                <div v-if="order.details && order.details.length > 0"
                                    class="card bg-surface-200 dark:bg-surface-800 h-auto xl:min-h-[20vh] xl:h-auto m-0 flex flex-col justify-between p-0 relative pb-3">
                                    <div>
                                        <div
                                            class=" font-bold flex justify-between pb-3 bg-neutral-600 rounded-t-md p-2">
                                            <div class="flex w-full">
                                                <div class="flex-wrap flex-1">
                                                    <div class="text-2xl">
                                                        Order #{{ order.id }}
                                                    </div>
                                                    <div class="text-sm">
                                                        Order time: 11:30am
                                                    </div>
                                                </div>
                                                <div class="flex  justify-end ">
                                                    <Avatar
                                                        image="https://static.vecteezy.com/system/resources/previews/017/189/658/original/cute-cartoon-fox-funny-red-fox-for-collection-emotion-little-animal-cartoon-animal-character-design-flat-illustration-isolated-on-white-background-adorable-cute-illustration-clean-design-free-vector.jpg"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Jan Dyze Malaluan'" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex text-xl px-4 pt-1 gap-4 pb-1" v-for="detail in order.details"
                                            :key="detail.detail_id">
                                            <div class="pr-2">
                                                <Checkbox :model-value="detail.status === 'serving'"
                                                    @change="() => updateOrderStatus(order, detail)" :binary="true" />
                                            </div>
                                            <div :class="{ 'strikethrough': detail.status === 'serving' }">
                                                {{ detail.quantity }}x
                                            </div>
                                            <div :class="{ 'strikethrough': detail.status === 'serving' }">
                                                {{ detail.menu_name }}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </transition-group>
                    </div>
                    <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                        <transition-group name="fade" tag="div">

                            <div class="flex flex-col gap-y-2 mb-2"
                                v-for="order in activeOrders.filter((_, index) => index % 3 === 1)" :key="order.id">

                                <div v-if="order.details && order.details.length > 0"
                                    class="card bg-surface-200 dark:bg-surface-800 h-auto xl:min-h-[20vh] xl:h-auto m-0 flex flex-col justify-between p-0 relative pb-3">
                                    <div>
                                        <div
                                            class=" font-bold flex justify-between pb-3 bg-neutral-600 rounded-t-md p-2">
                                            <div class="flex w-full">
                                                <div class="flex-wrap flex-1">
                                                    <div class="text-2xl">
                                                        Order #{{ order.id }}
                                                    </div>
                                                    <div class="text-sm">
                                                        Order time: 11:30am
                                                    </div>
                                                </div>
                                                <div class="flex  justify-end ">
                                                    <Avatar
                                                        image="https://static.vecteezy.com/system/resources/previews/017/189/658/original/cute-cartoon-fox-funny-red-fox-for-collection-emotion-little-animal-cartoon-animal-character-design-flat-illustration-isolated-on-white-background-adorable-cute-illustration-clean-design-free-vector.jpg"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Jan Dyze Malaluan'" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex text-xl px-4 pt-1 gap-4 pb-1" v-for="detail in order.details"
                                            :key="detail.detail_id">
                                            <div class="pr-2">
                                                <Checkbox :model-value="detail.status === 'serving'"
                                                    @change="() => updateOrderStatus(order, detail)" :binary="true" />
                                            </div>
                                            <div :class="{ 'strikethrough': detail.status === 'serving' }">
                                                {{ detail.quantity }}x
                                            </div>
                                            <div :class="{ 'strikethrough': detail.status === 'serving' }">
                                                {{ detail.menu_name }}
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>
                        </transition-group>
                    </div>
                    <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                        <transition-group name="fade" tag="div">

                            <div class="flex flex-col gap-y-2 mb-2"
                                v-for="order in activeOrders.filter((_, index) => index % 3 === 2)" :key="order.id">

                                <div v-if="order.details && order.details.length > 0"
                                    class="card bg-surface-200 dark:bg-surface-800 h-auto xl:min-h-[20vh] xl:h-auto m-0 flex flex-col justify-between p-0 relative pb-3">
                                    <div>
                                        <div
                                            class=" font-bold flex justify-between pb-3 bg-neutral-600 rounded-t-md p-2">
                                            <div class="flex w-full">
                                                <div class="flex-wrap flex-1">
                                                    <div class="text-2xl">
                                                        Order #{{ order.id }}
                                                    </div>
                                                    <div class="text-sm">
                                                        Order time: 11:30am
                                                    </div>
                                                </div>
                                                <div class="flex  justify-end ">
                                                    <Avatar
                                                        image="https://static.vecteezy.com/system/resources/previews/017/189/658/original/cute-cartoon-fox-funny-red-fox-for-collection-emotion-little-animal-cartoon-animal-character-design-flat-illustration-isolated-on-white-background-adorable-cute-illustration-clean-design-free-vector.jpg"
                                                        class="mr-2" shape="circle"
                                                        style="border: 2px solid #4caf50; padding: 2px;" size="large"
                                                        v-tooltip="'Jan Dyze Malaluan'" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex text-xl px-4 pt-1 gap-4 pb-1" v-for="detail in order.details"
                                            :key="detail.detail_id">
                                            <div class="pr-2">
                                                <Checkbox :model-value="detail.status === 'serving'"
                                                    @change="() => updateOrderStatus(order, detail)" :binary="true" />
                                            </div>
                                            <div :class="{ 'strikethrough': detail.status === 'serving' }">
                                                {{ detail.quantity }}x
                                            </div>
                                            <div :class="{ 'strikethrough': detail.status === 'serving' }">
                                                {{ detail.menu_name }}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </transition-group>
                    </div>
                </div>
            </div>
        </div>
        <Dialog v-model:visible="previousOrders" modal :style="{ width: '80vw', height: '100%' }" position="topright">


            <div class="flex">


            </div>
        </Dialog>

    </template>

<style scoped>
.item-border {
    border: 2px solid #a7af4c;
    padding: 2px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}

.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.strikethrough {
    text-decoration: line-through;
    opacity: 0.6;
}
</style>
