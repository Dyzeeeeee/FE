    <script setup>
    import { baseImageUrl } from '@/config'; // Make sure the path is correct based on your project structure
    import { useLayout } from '@/layout/composables/layout';
    import axios from 'axios';
    import QrcodeVue from 'qrcode.vue';

    import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
    const text = ref(localStorage.getItem('qrCode') || 'AIVR12345');
    const timerRef = ref(null);

    const generateRandomQR = () => {
        const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        text.value = `AIVR${randomNumber}`;
        localStorage.setItem('qrCode', text.value);
    }
    const { toggleDarkMode, isDarkTheme } = useLayout();
    const detailsVisible = ref(false); // Controls the visibility of the details drawer

    const showOrderDetails = () => {
        detailsVisible.value = false;  // Close the details drawer
        visible.value = true;          // Open the orders view
    };


    const formattedTime = computed(() => {
        const minutes = Math.floor(countdown.value / 60);
        const seconds = countdown.value % 60;
        return `${padTime(minutes)}:${padTime(seconds)}`;
    });
    const orderItemCount = computed(() => orderDetails.value.length);


    const removeItem = async (detail) => {
        // Optional: Confirm from the user before removal
        if (confirm('Are you sure you want to remove this item?')) {
            try {
                const response = await axios.delete(`/remove-order-detail/${detail.id}`); // Assuming the endpoint takes an ID in the URL

                // Check if the deletion was successful, considering a 200 OK or 204 No Content response as successful
                if (response.status === 200 || response.status === 204) {
                    console.log('Item removed successfully');
                    // Update the state by filtering out the deleted item
                    orderDetails.value = orderDetails.value.filter(d => d.id !== detail.id);
                } else {
                    console.error('Failed to remove the item:', response.data);
                }
            } catch (error) {
                // This will catch any network errors or cases where the response status code was not in the 2xx range
                console.error('Error removing item:', error);
                alert('Failed to remove the item.'); // Optionally, provide user feedback
            }
        }
    };

    const updateQuantity = async (detail) => {
        // Parse to integer and validate
        const newQuantity = parseInt(detail.quantity, 10);
        if (isNaN(newQuantity) || newQuantity < 1) {
            alert('Quantity must be a positive number');
            return;  // Stop if the quantity is invalid
        }

        detail.quantity = newQuantity; // Update the quantity in case the input was not a number

        try {
            // Prepare the data for the API request
            const updateData = {
                online_order_id: orderId.value,
                menu_item_id: detail.menu_item_id,
                quantity: newQuantity,
                subtotal: parseFloat(detail.price) * newQuantity,
            };

            // API call to update the order detail
            const response = await axios.post('/add-or-update-online-order-detail', updateData);
            if (response.status === 200 || response.status === 201) {
                console.log('Order detail updated:', response.data);
                await getOnlineOrderDetails();  // Refresh the list of order details
            } else {
                console.error('Failed to update order detail:', response.data);
            }
        } catch (error) {
            console.error('Error updating order detail:', error);
        }
    };




    function padTime(time) {
        return time.toString().padStart(2, '0');
    }

    let intervalId = null
    const selectedItem = ref(null); // Holds the currently selected menu item data

    const showDetails = (item) => {
        selectedItem.value = item; // Set the selected item
        detailsVisible.value = true; // Open the details drawer
    };
    const isItemAdded = (itemId) => {
        return orderDetails.value.some(detail => detail.menu_item_id === itemId);
    };
    const isFavorited = ref(false);
    const categories = ref([]);
    const selectedCategoryId = ref('All');  // Initially set to 'All'
    const allMenuItems = ref([]);  // Holds all menu items unfiltered
    const menuItems = ref([]);  // Holds items currently being displayed
    const orderId = ref(null);
    const QRcodeVisible = ref(false);
    const countdown = ref(20); // Countdown time in seconds (10 minutes)
    const orderDetails = ref([]);

    const filterCategory = (categoryId) => {
        selectedCategoryId.value = categoryId;  // Update the selected category ID
        menuItems.value = categoryId === 'All'
            ? allMenuItems.value
            : allMenuItems.value.filter(item => item.category_id === categoryId);
    };

    const createOrder = async (userId) => {
        try {
            generateRandomQR();
            console.log("text", text.value);
            const response = await axios.post('/create-online-order', { customer_id: userId, qrcode: text.value });
            if (response.data && response.data.id) {
                orderId.value = response.data.id;  // Set the newly created order ID in the reactive reference
                localStorage.setItem('orderId', orderId.value);  // Store the order ID in localStorage
                console.log('Order ID:', orderId.value); // Logging the order ID

                return orderId.value;
            }
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const totalOrderPrice = computed(() => {

        return orderDetails.value.reduce((total, detail) => total + parseFloat(detail.subtotal), 0);

    });

    const updateTotalPrice = async () => {
        if (orderId.value) {
            try {
                await axios.put(`/update-online-order/${orderId.value}`, { total_price: totalOrderPrice.value });
            } catch (error) {
                console.error('Error updating total price:', error);
            }
        }
    };

    const increaseQuantity = async (detail) => {
        detail.quantity = parseInt(detail.quantity, 10) + 1;  // Convert to integer and increment
        await updateOrderDetail(detail);
        // Call to update the backend
    };

    const decreaseQuantity = async (detail) => {
        if (parseInt(detail.quantity, 10) > 1) {  // Convert to integer and check
            detail.quantity = parseInt(detail.quantity, 10) - 1;  // Decrement the quantity
            await updateOrderDetail(detail);
            // Call to update the backend
        }
    };
    const starsPercentage = ref(30); // Example: 30%

    // Computed property to determine the number of full, half, and empty stars
    const starsDisplay = computed(() => {
        const totalStars = 5;
        const fullStars = Math.floor(starsPercentage.value / 20);
        const halfStar = (starsPercentage.value % 20 >= 10) ? 1 : 0;
        const emptyStars = totalStars - fullStars - halfStar;

        return {
            fullStars: fullStars,
            halfStar: halfStar,
            emptyStars: emptyStars
        };
    });




    const updateOrderDetail = async (detail) => {
        try {
            // Prepare the data for the API request
            const updateData = {
                online_order_id: orderId.value,
                menu_item_id: detail.menu_item_id,
                quantity: detail.quantity,
                subtotal: parseFloat(detail.price) * detail.quantity,
            };
            // API call to update the order detail
            const response = await axios.post('/add-or-update-online-order-detail', updateData);
            if (response.status === 200 || response.status === 201) {
                console.log('Order detail updated:', response.data);
                await getOnlineOrderDetails();
                // Refresh the list of order details
            } else {
                console.error('Failed to update order detail:', response.data);
            }
        } catch (error) {
            console.error('Error updating order detail:', error);
        }
    };



    const addToOrder = async (menuItem) => {
        const userId = sessionStorage.getItem('userId');
        orderId.value = localStorage.getItem('orderId');
        detailsVisible.value = false;
        // Ensure an order exists before trying to add items to it
        if (!orderId.value) {
            orderId.value = await createOrder(userId);
        }

        // Proceed only if an order ID is available
        if (orderId.value) {
            try {
                // Make the API call to fetch current order details to check if item exists
                const orderDetailsResponse = await axios.get(`/get-online-order-details/${orderId.value}`);
                orderDetails.value = orderDetailsResponse.data;
                console.log("value: ", orderDetails.value)
                console.log(orderDetailsResponse)
                const existingItem = orderDetailsResponse.data.find(detail => detail.menu_item_id === menuItem.id);

                // Prepare the data for the API request
                let orderDetail = {
                    online_order_id: orderId.value,
                    menu_item_id: menuItem.id,
                    quantity: 1, // Default quantity if the item does not exist yet
                    subtotal: menuItem.price // Assuming 'price' field exists in menuItem
                };

                // If item already exists, increment the quantity
                if (existingItem) {
                    orderDetail.quantity = parseInt(existingItem.quantity, 10) + 1; // Base 10
                    orderDetail.subtotal = parseFloat(menuItem.price) * orderDetail.quantity;
                }


                // Make the API call to add or update the order detail
                const response = await axios.post('/add-or-update-online-order-detail', orderDetail);
                console.log('Item added/updated in order:', response.data);
                getOnlineOrderDetails();
                // Optionally, update UI or state based on successful addition/update
            } catch (error) {
                console.error('Error adding/updating item in order:', error);
            }
        } else {
            console.error('No order ID found, cannot add/update item in order.');
        }
    };







    const getMenu = async () => {
        try {
            const response = await axios.get('/get-menu');
            allMenuItems.value = response.data.map(item => ({
                ...item,
                imageUrl: `${baseImageUrl}${encodeURIComponent(item.image)}`
            }));
            menuItems.value = allMenuItems.value;  // Initially show all items
        } catch (error) {
            console.error('Error fetching menu:', error);
        }
    };
    const isConfirmed = ref(0); // This will track if the order is confirmed or not (0 = not confirmed, 1 = confirmed)

    const setQRVisibility = (visible) => {
        if (isConfirmed.value == 0) {  // Only allow showing QR code if confirmed is 0
            QRcodeVisible.value = visible;
            if (visible) {
                if (timerRef.value) {
                    clearTimeout(timerRef.value); // Clear any existing timer
                }
                timerRef.value = setTimeout(() => {
                    QRcodeVisible.value = false;
                }, 600000); // 10 minutes for QR code visibility
            } else if (timerRef.value) {
                clearTimeout(timerRef.value); // Clear timer when dialog is manually closed
            }
        } else {
            alert("Order is already confirmed!"); // Show a message if the order is already confirmed
        }
    }

    const getOnlineOrder = async () => {
        try {
            orderId.value = localStorage.getItem('orderId'); // Get the order ID from local storage

            if (orderId.value) {
                const response = await axios.get(`/get-online-order/${orderId.value}`); // API call to get online order

                if (response && response.data) {
                    // Store the fetched order details
                    const order = response.data;
                    isConfirmed.value = order.confirmed; // Assuming the order has a 'confirmed' field
                    console.log('Order fetched:', order);
                } else {
                    console.error('No data received for the order');
                }
            }
        } catch (error) {
            console.error('Error fetching the online order:', error);
        }
    };


    const getOnlineOrderDetails = async () => {
        try {
            orderId.value = localStorage.getItem('orderId');

            const response = await axios.get(`/get-online-order-details/${orderId.value}`); // API call
            if (response && response.data) {
                orderDetails.value = response.data;  // Store the fetched categories data
                console.log('Details fetched:', response.data);
            } else {
                console.error('No data received from the server');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);  // Error handling
        }
    };


    const getCategories = async () => {
        try {
            const response = await axios.get('/get-categories'); // API call
            if (response && response.data) {
                categories.value = response.data;  // Store the fetched categories data
                console.log('Categories fetched:', response.data);
            } else {
                console.error('No data received from the server');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);  // Error handling
        }
    };

    watch(totalOrderPrice, () => {
        updateTotalPrice();
    }, {
        deep: true  // This option isn't necessary here but could be useful if watching nested data
    });

    function toggleFavorite() {
        isFavorited.value = !isFavorited.value;
    }
    const confirmedVisible = ref(false);

    watchEffect(async () => {
        if (QRcodeVisible.value) {
            if (intervalId !== null) {
                clearInterval(intervalId); // Clear existing timer if it exists
            }
            countdown.value = 300; // Reset countdown
            visible.value = false;
            intervalId = setInterval(async () => {
                if (countdown.value > 0) {
                    countdown.value--;
                    await checkOrderConfirmation(); // Check order confirmation status
                } else {
                    clearInterval(intervalId);
                    intervalId = null;
                    QRcodeVisible.value = false; // Close the QR code dialog
                }
            }, 1000); // Update countdown every second
        } else {
            if (intervalId !== null) {
                clearInterval(intervalId); // Clear the timer when dialog is manually closed
                intervalId = null;
            }
        }
    });

    // Function to check if the order is confirmed
    async function checkOrderConfirmation() {
        try {
            const response = await axios.get(`/get-online-order/${orderId.value}`);
            if (response.data && response.data.confirmed == 1) {
                isConfirmed.value = 1; // Update the confirmed status
                clearInterval(intervalId); // Stop the countdown
                QRcodeVisible.value = false; // Close the QR dialog
                clearOrderDetails(); // Clear order details
                isConfirmed.value = 0;
                confirmedVisible.value = true;
            }
        } catch (error) {
            console.error('Error checking order confirmation:', error);
        }
    }

    // Function to clear order details
    function clearOrderDetails() {
        orderDetails.value = []; // Clear the order details
        localStorage.removeItem('orderId'); // Clear the order ID from localStorage
        orderId.value = null; // Reset the order ID state
    }


    const visible = ref(false);

    watch(visible, (newValue) => {
        if (newValue) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    });

    onMounted(async () => {
        getCategories();
        getMenu();
        getOnlineOrderDetails();
        getOnlineOrder();
        console.log("confi", isConfirmed.value)
    });

    onUnmounted(() => {
        if (intervalId !== null) {
            clearInterval(intervalId); // Ensure no dangling interval on component unmount
        }
    });

</script>

    <template>
        <!-- <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
            <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button> -->
        <div class="flex text-xl font-bold pt-4 pb-5 pl-4">
            MENU
        </div>
        <div class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold"
            style="overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none;">
            <Icon icon="fe:arrow-left" width="50" height="50" @click="scrollToLeft"
                class="cursor-pointer pb-2  hidden xl:block" />
            <div ref="scrollContainer"
                class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold relative overflow-x-auto whitespace-nowrap"
                style="scrollbar-width: none; -ms-overflow-style: none;">

                <Button rounded :outlined="selectedCategoryId !== 'All'" @click="filterCategory('All')" size="small"
                    class="min-w-[5rem] xl:min-w-[7rem]">
                    All
                </Button>
                <Button v-for="category in categories" :key="category.id" :outlined="selectedCategoryId !== category.id"
                    rounded class="min-w-[7rem] xl:min-w-[7rem]" size="small" @click="filterCategory(category.id)">
                    {{ category.name }}
                </Button>
            </div>
            <Icon icon="fe:arrow-right" width="50" height="50" @click="scrollToRight"
                class="cursor-pointer pb-2 hidden xl:block" />
        </div>

        <div class="grid grid-cols-12 xl:gap-4 gap- mt-5 pb-12 mb-12">
            <!---->
            <!-- <div class="col-span-6 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 gap-2">

                <div class="card p-0 h-auto pb-5 mx-2 mb-4">
                    <div class="flex relative ">
                        <div class="text-3xl p-2 absolute bg-red-500 rounded-r-lg  font-bold bottom-3">
                            Price
                        </div>
                        <img src="https://images.deliveryhero.io/image/fd-ph/Products/7425037.jpg??width=500"
                            class="object-cover xl:h-[20vh] h-[20vh] w-full rounded-t-lg" />

                    </div>
                    <div class="flex  pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                        <div class="xl:w-2/12"></div>
                        <div class="xl:w-70 flex-1 flex-wrap">
                            <div class="flex justify-between w-full">
                                <div class="flex flex-col">
                                    <div class="text-2xl font-bold xl:text-4xl">Eme</div>
                                    <div class="text-sm italic xl:text-lg">10-15 minutes</div>
                                </div>
                                <div class="self-center px-4">
                                    <Button size="small" rounded @click="addToOrder(item)">
                                        Add to Order
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
            <!---->
            <div class="col-span-6 lg:col-span-6 xl:col-span-8 -mx7 xl:m-0 mb-3" v-for="item in menuItems"
                :key="item.id">
                <div class="card p-0 h-auto pb-5 mx-2 mb-4 min-h-[35vh] max-h-[35vh] relative ">
                    <div class="flex relative ">
                        <div v-if="isItemAdded(item.id)"
                            class="absolute top-0 right-0 m-3 bg-indigo-500 text-white px-2 py-1 rounded-lg text-sm">
                            Added
                        </div>
                        <div class="text-xl p-2 absolute bg-red-500 rounded-r-lg  font-bold bottom-3">
                            ₱{{ item.price }}
                        </div>
                        <img :src="item.imageUrl" class="object-cover xl:h-[20vh] h-[20vh] w-full rounded-t-lg" />

                    </div>
                    <div class="flex  pt-2 ml-4 xl:ml-0 xl:pt-0 xl:mt-4">
                        <div class="xl:w-2/12"></div>
                        <div class="xl:w-70 flex-1 flex-wrap">
                            <div class="flex justify-between w-full">
                                <div class="flex flex-col gap-0">
                                    <div class="text-xl font-bold xl:text-4xl">
                                        {{ item.name }}
                                    </div>
                                    <div class="text-sm italic">
                                        10-20 minutes
                                    </div>
                                </div>
                                <div class="self-center px-4 absolute bottom-2 right-0 w-full flex gap-2">
                                    <Button size="small" @click="showDetails(item)" outlined style="" class="w-full"
                                        severity="info">
                                        Details
                                    </Button>
                                    <Button size="small" @click="addToOrder(item)" outlineld style="" class="w-full">
                                        <Icon icon="mingcute:plus-fill" height="15" />
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-3">
            <Badge v-if="orderItemCount > 0" :value="orderItemCount" severity="danger"
                style="position: absolute; top: 0; right: 0; z-index: 99;">
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
                            <div v-for="detail in orderDetails" :key="detail.id">
                                <div class="flex mb-3 gap-2">
                                    <div class="font-bold text-xl self-end flex-grow">
                                        {{ detail.name }}
                                    </div>
                                    <div class="self-center flex-wrap text-lg  text-end px-4">
                                        <div class="text-sm italic">
                                            Subtotal
                                        </div>
                                        <div class="font-bold">P {{ detail.subtotal }}</div>
                                        <!-- Price, assuming a currency filter -->
                                    </div>
                                </div>
                                <div class="flex gap-2 pt-2 justify-between mr-3">
                                    <div class="flex items-center w-1/3 h-full ml-3">
                                        <div class="flex-wrap">
                                            <div class="text-sm mr-1 font-bold">
                                                Price:
                                            </div>
                                            <div class="text-base italic">
                                                P {{ detail.price }}
                                            </div>
                                        </div>
                                    </div>
                                    <div style="width: 55%;">
                                        <InputGroup class="w-full" style="height: 30px">
                                            <Button :severity="detail.quantity > 1 ? 'primary' : 'danger'" size="small"
                                                class="w-4/12 h-full"
                                                @click="detail.quantity > 1 ? decreaseQuantity(detail) : removeItem(detail)">
                                                <Icon :icon="detail.quantity > 1 ? 'ic:sharp-minus' : 'mi:delete'"
                                                    width="15" height="15" />
                                            </Button>
                                            <InputText v-model="detail.quantity" @change="updateQuantity(detail)"
                                                placeholder="0" class="h-full" />
                                            <Button severity="primary" size="small" class="w-4/12 h-full"
                                                @click="increaseQuantity(detail)">
                                                <Icon icon="ic:sharp-plus" width="15" height="15" />
                                            </Button>
                                        </InputGroup>



                                    </div>
                                </div>

                                <Divider />

                            </div>



                        </div>
                    </div>
                </div>
                <div class="w-full">
                    <div class="flex-wrap mb-3 gap-2">
                        <div class="flex mb-3">
                            <div class="flex justify-start px-4 ">
                                <span class="font-bold text-xl self-center">Total Price</span>
                            </div>
                            <div class="flex-1 text-end gap-2 align-self-end ">
                                <span class="font-bold text-2xl pr-4">P {{ totalOrderPrice }}</span>
                            </div>
                        </div>
                        <div class="flex justify-center">
                            <div class="flex-1 text-end gap-2 justify-center flex ">
                                <Button :disabled="!orderDetails.length" severity="success" class="w-full xl:w-auto"
                                    @click="setQRVisibility(true)">
                                    <Icon icon="ic:baseline-payments" width="20" height="20" />
                                    <div class="font-bold">Confirm Order</div>
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>


        <Dialog v-model:visible="QRcodeVisible" modal :style="{ width: '90vw', height: '80%' }" position="center"
            header="Order QR Code" @update:visible="setQRVisibility">
            <div class="flex w-full text-center">
                <div class="text-2xl font-bold w-full">{{ text }}</div>
            </div>
            <div class="flex justify-center mt-4">
                <qrcode-vue :value="text" size='270' level='L' margin="3" class="rounded-xl" />
            </div>
            <div class="italic mt-2 text-light text-sm">
                <span class="italic mt-2 text-light text-sm">
                    Let any staff from <span class="font-bold">Anahaw Island View Resort</span>
                    scan your QR code or let them know about the code above the QR.
                </span>
            </div>
            <div v-if="QRcodeVisible" class="flex">
                <span class="font-bold">Time Remaining: </span>
                <p>&nbsp;{{ formattedTime }}</p>
            </div>
        </Dialog>


        <Dialog v-model:visible="confirmedVisible" modal :style="{ width: '90vw', height: '40%' }" position="center"
            class="p-0" style="margin: -50px;">
            <div class="flex w-full text-green-400 justify-center">
                <Icon icon="line-md:confirm-circle-twotone" height="70" />
            </div>
            <div class="flex w-full text-green-400 justify-center text-xl font-bold">
                Order Confirmed
            </div>
            <div class="flex w-full italic justify-center">
                Kindly wait for your order as it is being prepared
            </div>
            <div class="flex w-full italic justify-center mt-2">
                <Button severity="info" class="w-full">
                    <div class="font-bold">
                        Track My Order
                    </div>

                    <Icon icon="arcticons:whereyougo" width="20" height="20" />
                </Button>
            </div>
        </Dialog>

        <Drawer v-model:visible="detailsVisible" header="Item Details" position="bottom" class="opacity-90"
            :style="{ width: '100%', height: '80vh' }">
            <div v-if="selectedItem" class="h-full justify-between flex flex-col">
                <div>
                    <div class="w-full bg-white justify-center flex rounded-lg py-3 mb-2">
                        <img :src="selectedItem.imageUrl" class="h-[20vh] w-auto " />
                    </div>
                    <div class="text-2xl font-bold">{{ selectedItem.name }}</div>
                    <div class="text-yellow-500 flex gap-1">
                        <Icon v-for="index in starsDisplay.fullStars" :key="'full-' + index" icon="ic:round-star"
                            height="20" />
                        <Icon v-if="starsDisplay.halfStar" icon="ic:round-star-half" height="20" />
                        <Icon v-for="index in starsDisplay.emptyStars" :key="'empty-' + index"
                            icon="ic:round-star-outline" height="20" />
                    </div>
                    <p>{{ selectedItem.description }}</p>
                    <div>
                        Price: ₱{{ selectedItem.price }}
                    </div>
                </div>
                <!-- Conditionally render buttons based on if item is added to order -->
                <div class="flex justify-center mt-4 mb-4">
                    <Button v-if="!isItemAdded(selectedItem.id)" @click="addToOrder(selectedItem)"
                        class="w-full xl:w-auto" severity="success">
                        <Icon icon="ic:baseline-add-shopping-cart" height="20" />
                        <b>Add to Order</b>
                    </Button>
                    <Button v-else @click="showOrderDetails" class="w-full xl:w-auto" severity="info">
                        <Icon icon="ic:outline-shopping-cart" height="20" />
                        <b>My Orders</b>
                    </Button>
                </div>
            </div>
            <!-- Optional else case if no item is selected -->
            <div v-else class="flex justify-center items-center h-full">
                <p>Select an item to see details</p>
            </div>
        </Drawer>


    </template>

<style scoped>
.item-border {
    border: 2px solid #a7af4c;
    padding: 2px;
}
</style>
