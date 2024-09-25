<script setup>
import defaultProfilePic from '@/assets/pics/defaultprofile.png';
import { baseImageUrl } from '@/config'; // Make sure the path is correct based on your project structure
import axios from 'axios';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from "primevue/usetoast";
import { computed, onMounted, ref, watch } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const printOrder = () => {
    printVisible.value = true; // Ensure receipt is visible
    setTimeout(() => {
        window.print(); // Open the print dialog
        printVisible.value = false; // Hide the receipt after printing to return to normal view
    }, 100);
};
const endSessionVisible = ref(false);
const visible = ref(false);
const categories = ref([]); // Assuming you're using Vue.js with ref for reactivity
const allMenuItems = ref([]);  // Holds all menu items unfiltered
const menuItems = ref([]);  // Holds items currently being displayed
const scrollContainer = ref(null);
const selectedCategoryId = ref('All');  // Initially set to 'All'
const orderId = ref(null);
const selectedService = ref('Dine in');  // Initially set to 'All'  
const route = useRoute();
const sessionId = route.params.id;
const confirm = useConfirm();
const toast = useToast();
const orderDetails = ref([]);
const orders = ref([]);
const customers = ref([]);
const paymentVisible = ref(false);
const printVisible = ref(false);
const paymentMethod = ref('cash'); // Holds the selected payment method
const tempOrderId = ref(null);
const selectedOrder = ref();
const QRcodeVisible = ref(false);
const QRcode = ref('');
const setPaymentMethod = (method) => {
    paymentMethod.value = method;
};
const opening_cash = localStorage.getItem('opening_cash')

const goToOrder = async () => {
    // Ensure an order is selected and check if the order status is 'canceled'
    if (selectedOrder.value && selectedOrder.value.status !== 'cancelled' && selectedOrder.value.status !== 'paid') {
        orderId.value = selectedOrder.value.id;  // Assume the order ID is stored in selectedOrder
        await getOrderDetails(orderId.value);
        allOrders.value = false;  // Close the orders dialog/modal
    } else if (selectedOrder.value.status === 'paid') {
        toast.add({
            severity: 'error',
            summary: 'Action Forbidden',
            detail: 'You cannot go to an order with the status "paid".',
            life: 3000
        });
    }
    else {
        // Optionally, show a message or toast notification about the error
        toast.add({
            severity: 'error',
            summary: 'Action Forbidden',
            detail: 'You cannot go to an order with the status "canceled".',
            life: 3000
        });
    }
}



const confirmOrder = async () => {
    try {
        // Retrieve session_id from route parameters
        const session_id = route.params.id;

        // Build the data payload to include session_id
        const payload = {
            qrcode: QRcode.value,
            session_id  // Using shorthand for object properties when names match
        };

        // Sending the QR code and session_id to the server to confirm the order
        const response = await axios.put(`/confirmOrder/AIVR${encodeURIComponent(QRcode.value)}`, payload, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        });

        cameraVisible.value = false;

        console.log("data from putting: ", response.data.newOrderId)

        if (response.status === 200) {
            toast.add({ severity: 'success', summary: 'Order Confirmed', detail: 'The order has been confirmed successfully!', life: 3000 });
            QRcodeVisible.value = false; // Close the QR code dialog
            getOrders();
            orderId.value = response.data.newOrderId;
            getOrderDetails();// Refresh the list of orders; // Set the latest order ID if provided by the backend
        } else {
            throw new Error('Order confirmation failed');
        }
    } catch (error) {
        console.error('Error confirming order:', error);
        toast.add({ severity: 'error', summary: 'Confirmation Failed', detail: 'Failed to confirm the order.', life: 3000 });
    }
};



const confirmEnd = () => {
    confirm.require({
        message: 'Are you sure you want to end this session?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            severity: 'danger',
            label: 'End This Session'
        },
        accept: () => {
            endSession();
            // toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Session Ended', life: 3000 });
        },
        reject: () => {
            // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
    return `${formattedDate} (${formattedTime})`;
};
const filteredOrders = computed(() => {
    return orders.value
        .filter(order => order.session_id === route.params.id)
        .sort((a, b) => b.id - a.id); // Sorting by ID in descending order
});

const cameraActive = ref(false);
const scannedContent = ref('');


const allOrders = ref(false);
const allCustomers = ref(false);

const amountTendered = ref(0); // Holds the amount tendered by the customer

const cancelOrder = async () => {
    try {
        orderId.value = tempOrderId.value;
        const response = await axios.put(`/update-order/${orderId.value}`, {
            total_price: 0,
            status: 'cancelled',
            tendered: 0,
            change1: 0,
            payment_method: null,
            service: null
        }, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        });


        // if (response.status === 200) {
        //     toast.add({ severity: 'success', summary: 'Payment Processed', detail: 'Payment has been successfully processed!', life: 3000 });
        //     // Optionally, reset fields or redirect user
        //     paymentVisible.value = false; // Close payment drawer
        //     orderDetails.value = [];
        //     orderId.value = null;
        //     localStorage.removeItem('orderId');
        //     amountTendered.value = 0; // Holds the amount tendered by the customer
        // }

        getOrders();
        getOrderDetails();
        allOrders.value = false;
        orderId.value = null; // Close payment drawer
    } catch (error) {
        console.error('Failed to process payment:', error);
        toast.add({ severity: 'error', summary: 'Payment Failed', detail: 'Failed to process the payment.', life: 3000 });
    }
}


// Function to process payment
const processPayment = async () => {
    const change = amountTendered.value - totalPrice.value; // Calculate change

    try {
        // Update the order in the database with payment details
        const response = await axios.put(`/update-order/${orderId.value}`, {
            total_price: totalPrice.value,
            status: 'paid',
            tendered: amountTendered.value,
            change1: change >= 0 ? change : 0,
            payment_method: paymentMethod.value,
            service: selectedService.value
        }, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        });

        if (response.status === 200) {
            toast.add({ severity: 'success', summary: 'Payment Processed', detail: 'Payment has been successfully processed!', life: 3000 });
            // Optionally, reset fields or redirect user
            paymentVisible.value = false;
            printVisible.value = true;
        }
        if (printVisible.value === false) {
            orderDetails.value = [];
            orderId.value = null;
            localStorage.removeItem('orderId');
            amountTendered.value = 0;

        }// Holds the amount tendered by the customer
        getOrders();
        getOrderDetails();
    } catch (error) {
        console.error('Failed to process payment:', error);
        toast.add({ severity: 'error', summary: 'Payment Failed', detail: 'Failed to process the payment.', life: 3000 });
    }

};

const handleRowClick = async (order) => {
    selectedOrder.value = order;
    tempOrderId.value = order.data.id;
    // console.log('DATA IS: ', selectedOrder.value.data.id);
    // toast.add({ severity: 'info', summary: 'Order Selected', detail: `You are now viewing details for Order #${order.data.id}.` });
};
const confirm1 = async (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Make a new order?',
        // icon: 'pi pi-chevron-circle-right',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Proceed'
        },
        accept: () => {
            newOrder();
            toast.add({ severity: 'success', summary: 'New Order Made', detail: 'Click on the "All Orders" button to view previous orders', life: 3000 });
        },
        reject: () => {
            // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
};


const totalPrice = computed(() => {
    return orderDetails.value.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);
});

const quantityChanged = async (detail, newQuantity) => {
    if (!orderId.value) {
        toast.add({ severity: 'warn', summary: 'No Order', detail: 'Please start an order first.', life: 3000 });
        return;
    }

    // Convert new quantity to a number to ensure no string operations occur
    newQuantity = parseInt(newQuantity, 10);
    if (newQuantity < 1) {
        // toast.add({ severity: 'warn', summary: 'Invalid Operation', detail: 'Quantity cannot be less than 1.', life: 3000 });
        return; // Preventing negative quantities
    }

    const updatedSubtotal = newQuantity * parseFloat(detail.price);

    try {
        await axios.put(`/update-order-detail/${detail.id}`, {
            quantity: newQuantity,
            subtotal: updatedSubtotal
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        // Refresh order details after update
        getOrderDetails();
        // toast.add({ severity: 'success', summary: 'Quantity Updated', detail: 'Order quantity updated successfully!', life: 3000 });
    } catch (error) {
        console.error('Failed to update quantity:', error);
        // toast.add({ severity: 'error', summary: 'Update Failed', detail: 'Failed to update item quantity.', life: 3000 });
    }
};

watch([totalPrice, selectedService], async ([newTotal, newService], [oldTotal, oldService]) => {
    if (newTotal !== oldTotal || newService !== oldService) {
        try {
            await axios.put(`/update-order/${orderId.value}`, {
                total_price: newTotal,
                service: newService
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            // toast.add({ severity: 'success', summary: 'Order Updated', detail: 'Order details updated successfully!', life: 3000 });
        } catch (error) {
            console.error('Failed to update order:', error);
            // toast.add({ severity: 'error', summary: 'Update Failed', detail: 'Failed to update order details.', life: 3000 });
        }
    }
}, { immediate: false });


const removeOrderDetail = async (detail) => {

    try {
        await axios.delete(`/delete-order-detail/${detail.id}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        // Remove the item from the order details list locally
        orderDetails.value = orderDetails.value.filter(d => d.id !== detail.id);
        // toast.add({ severity: 'success', summary: 'Removed', detail: 'Item has been removed from the order.', life: 3000 });
    } catch (error) {
        console.error('Failed to delete item from order:', error);
        // toast.add({ severity: 'error', summary: 'Failed to Remove', detail: 'Failed to remove item from order.', life: 3000 });
    }
};

const updateQuantity = async (detail, increment = true) => {
    if (!orderId.value) {
        toast.add({ severity: 'warn', summary: 'No Order', detail: 'Please start an order first.', life: 3000 });
        return;
    }

    // Explicitly parse the quantity as an integer to avoid string concatenation
    let currentQuantity = parseInt(detail.quantity, 10);
    let newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 1) {
        // toast.add({ severity: 'warn', summary: 'Invalid Operation', detail: 'Quantity cannot be less than 1.', life: 3000 });
        return; // Preventing negative quantities
    }

    const updatedSubtotal = newQuantity * parseFloat(detail.price);

    try {
        await axios.put(`/update-order-detail/${detail.id}`, {
            quantity: newQuantity,
            subtotal: updatedSubtotal
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        // Refresh order details after update
        getOrderDetails();
        // toast.add({ severity: 'success', summary: 'Updated Order', detail: 'Item quantity updated successfully!', life: 3000 });
    } catch (error) {
        console.error('Failed to update item in order:', error);
        // toast.add({ severity: 'error', summary: 'Update Failed', detail: 'Failed to update item quantity.', life: 3000 });
    }
};

const setExactAmount = () => {
    amountTendered.value = totalPrice.value; // Set the amount tendered to the total price
};
const statusSeverity = (order) => {
    switch (order.status) {
        case 'paid':
            return 'success';

        case 'pending':
            return 'warn';

        case 'cancelled':
            return 'danger';

        default:
            return null;
    }
};

const addToOrder = async (menuItem) => {


    // Find if the menu item already exists in the order details
    const existingDetail = orderDetails.value.find(detail => detail.menu_item_id === menuItem.id);

    try {
        let orderDetailData;
        // await getOrders();
        // await getOrderDetails();
        if (existingDetail) {
            // Prepare update data if item already exists in the order
            orderDetailData = {
                order_id: orderId.value,
                menu_item_id: menuItem.id,
                quantity: existingDetail.quantity + 1, // Increment quantity
                subtotal: (existingDetail.quantity + 1) * menuItem.price,
                price: menuItem.price // Storing the current price
                // Update subtotal based on new quantity
            };
        } else {
            if (!orderId.value) {
                await newOrder();
                orderDetailData = {
                    order_id: orderId.value,
                    menu_item_id: menuItem.id,
                    quantity: 1, // Default quantity is 1
                    subtotal: menuItem.price, // Subtotal is the price of one item
                    price: menuItem.price // Storing the current price

                };
            } else {
                // Prepare new order detail data if item is not in the order yet
                orderDetailData = {
                    order_id: orderId.value,
                    menu_item_id: menuItem.id,
                    quantity: 1, // Default quantity is 1
                    subtotal: menuItem.price, // Subtotal is the price of one item
                    price: menuItem.price // Storing the current price

                };
            }
        }

        // Send a POST request to add or update the order detail
        await axios.post('/add-or-update-order-detail', orderDetailData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        // Refresh order details after update or addition
        getOrders();
        getOrderDetails();

    } catch (error) {
        console.error('Failed to update or add item to order:', error);
    }
};



const scrollToRight = () => {
    if (scrollContainer.value) {
        // This will scroll by half the width of the container, you can adjust this value as needed
        const scrollAmount = scrollContainer.value.offsetWidth / 1.3;
        scrollContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
};
const scrollToLeft = () => {
    if (scrollContainer.value) {
        // This will scroll to the left by half the width of the container
        const scrollAmount = scrollContainer.value.offsetWidth / 1.3;
        scrollContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' });  // Note the negative value for left scrolling
    }
};

const getOrders = async () => {
    try {
        const response = await axios.get(`/get-orders`);
        orders.value = response.data;
        console.log(orders.value);
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
};

const getCustomers = async () => {
    try {
        const response = await axios.get(`/get-customers-accounts`);
        customers.value = response.data;
        console.log('custoers', response.data)
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
};

const getOrderDetails = async () => {
    try {
        const response = await axios.get(`/get-order-details/${orderId.value}`);
        orderDetails.value = response.data;
        console.log(orderDetails.value);
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
};

const selectService = async (service) => {
    if (!orderId.value) {
        toast.add({ severity: 'warn', summary: 'No Order', detail: 'Please start an order first.', life: 3000 });
        return;
    }

    try {
        const response = await axios.put(`/update-order/${orderId.value}`, {
            service: service  // Passing the new service type to the server
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (response.status === 200) {
            selectedService.value = service;  // Update the state only on successful API call
            // toast.add({ severity: 'success', summary: 'Service Updated', detail: 'Service type updated successfully.', life: 3000 });
        } else {
            throw new Error('Failed to update the service type');
        }
    } catch (error) {
        console.error('Failed to update service:', error);
        // toast.add({ severity: 'error', summary: 'Service Update Failed', detail: 'Failed to update the service type.', life: 3000 });
    }
};


watch(visible, (newValue) => {
    if (newValue) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
});



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

const totalCash = computed(() => {
    return filteredOrders.value
        .filter(order => order.status === 'paid') // Filter for completed orders
        .reduce((acc, order) => acc + parseFloat(order.total_price), parseFloat(opening_cash)); // Sum total_price, starting from opening_cash.value
});


// Add this function to your script setup
const endSession = async () => {
    // Check if any order is still pending
    const hasPendingOrders = orders.value.some(order => order.status === 'pending' && order.session_id === sessionId);

    if (hasPendingOrders) {
        toast.add({
            severity: 'warn',
            summary: 'Pending Orders',
            detail: 'Cannot end session because there are pending orders.',
            life: 3000
        });
        return; // Stop the function here if there are pending orders
    }

    try {
        const response = await axios.put(`/update-session/${sessionId}`, {
            status: 'closed',
            total_cash: totalCash.value // Use the computed total cash here
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (response.status === 200) {
            toast.add({
                severity: 'success',
                summary: 'Session Ended',
                detail: 'The session has been successfully closed!',
                life: 3000
            });
            // Optionally, redirect or refresh the view
            router.push('/staff/pos'); // Replace with the desired route
        }
    } catch (error) {
        console.error('Failed to close session:', error);
        toast.add({
            severity: 'error',
            summary: 'Session Closure Failed',
            detail: 'Failed to close the session.',
            life: 3000
        });
    }
};




// Filter function when a category button is clicked
const filterCategory = (categoryId) => {
    selectedCategoryId.value = categoryId;  // Update the selected category ID
    menuItems.value = categoryId === 'All'
        ? allMenuItems.value
        : allMenuItems.value.filter(item => item.category_id === categoryId);
};

const newOrder = async () => {
    try {
        const orderData = {
            session_id: sessionId,
            // opening_cash: openingCash.value,
            service: selectedService.value,
        };

        const response = await axios.post('/add-order', orderData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        await getOrders();
        await getOrderDetails();
        if (response.data && response.data.id) {
            orderId.value = response.data.id;
            localStorage.setItem('orderId', orderId.value);
            orderDetails.value = [];
        } else {
            console.error('Failed to retrieve order ID from the response');
        }
    } catch (error) {
        console.error('Failed to submit order:', error);
    }
};

onMounted(async () => {
    await getOrderDetails(); // Ensure order details are fetched and totalPrice is computed
    if (totalPrice.value > 0) {
        newOrder();
    }

    getCategories();
    getMenu();
    getOrders();
    getCustomers();
});

const onDetect = (detectedCodes) => {
    console.log('Detected QR Codes:', detectedCodes);

    // Remove 'AIVR' from the detected codes if present
    scannedContent.value = detectedCodes.map(code => {
        let rawValue = code.rawValue;
        if (rawValue.startsWith('AIVR')) {
            // Remove the 'AIVR' prefix
            return rawValue.substring(4); // Removes the first 4 characters
        }
        return rawValue; // Return the raw value if 'AIVR' is not present
    }).join(', ');

    QRcode.value = scannedContent.value;
    confirmOrder();
};


const onCameraOn = (capabilities) => {
    console.log('Camera is on, capabilities:', capabilities);
};

const onError = (error) => {
    console.error('Error with QR Code Stream:', error);
    scannedContent.value = ''; // Clear previous content on error
};

const cameraVisible = ref(false);

const toggleCamera = () => {
    cameraVisible.value = true;
    cameraActive.value = true;
    if (!cameraActive.value) {
        scannedContent.value = '';
    }
};
</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <Toast />
    <!-- <ConfirmDialog></ConfirmDialog> -->

    <Drawer v-model:visible="paymentVisible" position="right" style="width: 65vw" :pt="{
        root: 'border-none',
        mask: {
            style: 'backdrop-filter: blur(10px)',
        },
    }">
        <div class="flex h-full">

            <div class="w-1/2 h-full  text-white p-4 flex flex-col">
                <div class="mb-4">
                    <div class="text-2xl font-bold">Confirmation</div>
                    <div class="text-base font-bold italic">Order #{{ orderId }}</div>
                </div>

                <div class="flex font-bold text-lg mb-2">
                    <div class="w-1/2">Item and Price</div>
                    <div class="w-1/4 text-center">Quantity</div>
                    <div class="w-1/4 text-right">Subtotal</div>
                </div>
                <Divider />
                <Divider />
                <div class="flex-grow overflow-auto">
                    <div v-for="detail in orderDetails" :key="detail.id" class="flex mb-3 gap-2">
                        <div class="w-1/2 flex flex-col">
                            <span>{{ detail.name }}</span>
                            <span class="italic text-sm">₱{{ detail.price }}</span>
                        </div>
                        <div class="w-1/4 text-center self-center">{{ detail.quantity }}</div>
                        <div class="w-1/4 text-right self-center">₱{{ detail.subtotal }}</div>
                    </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-700">
                    <div class="flex justify-between">
                        <span class="font-bold text-xl">Total:</span>
                        <span class="font-bold text-xl">₱{{ totalPrice }}</span>
                    </div>
                </div>
            </div>


            <Divider layout="vertical" />
            <div class="w-1/2 h-full  text-white p-4 flex flex-col">
                <div class="mb-4">
                    <div class="text-2xl font-bold">Payment</div>
                    <div class="text-base font-bold italic">Customer</div>
                </div>

                <div class="flex-wrap font-bold text-lg mb-2 pb-4">
                    <div class="w-1/2 mb-2">Payment Method</div>
                    <div class="flex gap-2">
                        <Button class="w-1/5 flex flex-col items-center justify-center p-2" size="small"
                            :outlined="paymentMethod !== 'cash'" @click="setPaymentMethod('cash')">
                            <Icon icon="tabler:cash" width="20" height="20" />
                            <div>Cash</div>
                        </Button>
                        <Button class="w-1/5 flex flex-col items-center justify-center p-2" size="small"
                            :outlined="paymentMethod !== 'gcash'" @click="setPaymentMethod('gcash')">
                            <Icon icon="tabler:hexagon-letter-g-filled" width="20" height="20" />
                            <div>GCash</div>
                        </Button>
                        <Button class="w-1/5 flex flex-col items-center justify-center p-2" size="small"
                            :outlined="paymentMethod !== 'paypal'" @click="setPaymentMethod('paypal')">
                            <Icon icon="bxl:paypal" width="20" height="20" />
                            <div>PayPal</div>
                        </Button>
                        <Button class="w-1/5 flex flex-col items-center justify-center p-2" size="small"
                            :outlined="paymentMethod !== 'bank'" @click="setPaymentMethod('bank')">
                            <Icon icon="ph:bank-fill" width="20" height="20" />
                            <div>Bank</div>
                        </Button>

                    </div>
                </div>

                <div class="flex gap-2  border-gray-700 border-t pt-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <Icon icon="clarity:peso-solid" width="20" height="20" />
                        </InputGroupAddon>
                        <InputText v-model="amountTendered" placeholder="Amount Tendered" />
                    </InputGroup>
                    <Button severity="info" size="small" class="w-1/3" @click="setExactAmount">
                        <Icon icon="hugeicons:payment-success-01" width="20" height="20" />
                        <div>Exact</div>
                    </Button>
                </div>
                <div class="mt-4 pb-4 border-b border-gray-700">
                    <div class="flex justify-between">
                        <span class="font-bold text-xl">Change:</span>
                        <span class="font-bold text-xl">₱{{ amountTendered - totalPrice }}</span>
                    </div>
                </div>
                <div class="mt-4 pt-4 flex gap-2">

                    <Button severity="success" size="small" class="w-full h-[10vh]" @click="processPayment">
                        <Icon icon="line-md:confirm-circle-twotone" width="20" height="20" />
                        <div class="font-bold ">Confirm Payment</div>
                    </Button>
                </div>
            </div>

        </div>
    </Drawer>

    <div class="grid grid-cols-12 gap-3 -m-3 ">
        <div class="col-span-12 lg:col-span-6 xl:col-span-8 -mx-7 -my-7 xl:m-0 ">
            <div class="card mb-0 min-h-[87vh]  sm:p-4 xl:px-8">

                <div class=" grid grid-cols-12 mb-4 gap-2">
                    <div class="col-span-8 xl:col-span-7 mb-2">
                        <div class="flex flex-1 justify-start gap-2 font-bold">
                            <div class="xl:block">
                                <Button class="w-auto" size="small" severity="danger" @click="endSessionVisible = true">
                                    <Icon icon="material-symbols:tab-close-outline" width="20" height="20" />
                                    <div>End</div>
                                </Button>

                            </div>
                            <div class="xl:block">
                                <Button class="w-1/7" size="small">
                                    <Icon icon="uiw:filter" width="20" height="20" />
                                </Button>
                            </div>
                            <IconField iconPosition="left" class="w-3/4">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText placeholder="Search..." class="w-full" />
                            </IconField>
                            <div class="hidden xl:block">
                                <Button class="w-1/7" size="small">
                                    <Icon icon="cil:list" width="20" height="20" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-4 xl:col-span-5">
                        <div class="flex flex-1 justify-end gap-2">
                            <Button severity="info" class="w-full xl:w-auto" size="small" @click="toggleCamera">
                                <Icon icon="ph:camera-bold" width="20" height="20" />
                                <div class="font-bold hidden sm:block">Scan</div>
                            </Button>
                            <Button severity="info" class="w-full xl:w-auto" size="small" @click="allCustomers = true">
                                <Icon icon="ion:person-add-sharp" width="20" height="20" />
                                <div class="font-bold hidden sm:block">Customer</div>
                            </Button>
                            <div class="hidden xl:block">
                                <Button class="w-full xl:w-auto" severity="success" size="small"
                                    @click="confirm1($event)">
                                    <Icon icon="gridicons:add-outline" width="20" height="20" />
                                    <div class="font-bold hidden sm:block">New Order</div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="relative flex items-center w-full">
                    <Icon icon="fe:arrow-left" width="50" height="50" @click="scrollToLeft"
                        class="cursor-pointer pb-2  hidden xl:block" />
                    <div ref="scrollContainer"
                        class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold relative overflow-x-auto whitespace-nowrap"
                        style="scrollbar-width: none; -ms-overflow-style: none;">

                        <Button rounded :outlined="selectedCategoryId !== 'All'" @click="filterCategory('All')"
                            size="small" class="min-w-[5rem] xl:min-w-[7rem]">
                            All
                        </Button>
                        <Button v-for="category in categories" :key="category.id"
                            :outlined="selectedCategoryId !== category.id" rounded class="min-w-[7rem] xl:min-w-[7rem]"
                            size="small" @click="filterCategory(category.id)">
                            {{ category.name }}
                        </Button>
                    </div>
                    <!-- Floating Button positioned to the right -->
                    <Icon icon="fe:arrow-right" width="50" height="50" @click="scrollToRight"
                        class="cursor-pointer pb-2 hidden xl:block" />

                </div>



                <!-- Displaying the menu items dynamically -->
                <div class="grid grid-cols-12 h-auto my-2 gap-2 overflow-auto" style="max-height: calc(87vh - 170px)">
                    <div v-for="item in menuItems" :key="item.id"
                        class="card bg-surface-200 dark:bg-surface-800 col-span-12 sm:col-span-6 xl:col-span-4 h-[15vh] m-0 flex p-2 cursor-pointer"
                        @click="addToOrder(item)">

                        <div class="w-1/3 flex justify-center items-center xl:w-1/3">
                            <img :src="item.imageUrl" alt="Item Image"
                                class="rounded-full w-[11vh] h-[11vh] object-cover item-border" />
                        </div>
                        <div class="w-1/3 pl-4 flex flex-col justify-center xl:w-2/3">
                            <div class="text-base font-bold">{{ item.name }}</div>
                            <div class="text-sm">₱ {{ item.price }}</div>
                            <div class="text-xs text-green-600">Available</div>
                        </div>
                        <div class="w-1/3 pl-4 flex flex-col justify-center xl:hidden block">
                            <Button rounded severity="success">
                                <Icon icon="icomoon-free:plus" width="20" height="20" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="hidden xl:block col-span-12 lg:col-span-6 xl:col-span-4">
            <div class="card mb-0  min-h-[87vh] flex flex-col">
                <div class="flex-grow overflow-auto">
                    <!-- Top part of the card containing the order number and control buttons -->
                    <div class="grid grid-cols-12 mb-4">
                        <div class="col-span-12 xl:col-span-5 mb-2">
                            <div class="flex flex-1 justify-start gap-2 font-bold">
                                <div class="text-2xl flex">Order #{{ orderId }}</div>
                                <!-- <div class="text-base text-grey-200 flex">Order #1234</div> -->
                            </div>
                        </div>
                        <div class="col-span-12 xl:col-span-7">
                            <div class="flex flex-1 justify-end gap-2">
                                <Button class="w-full xl:w-auto" severity="info" size="small" @click="allOrders = true">
                                    <Icon icon="fluent:folder-24-filled" width="20" height="20" />
                                    <div class="font-bold hidden sm:block">All Orders</div>
                                </Button> <Button class="w-full xl:w-auto" severity="info" size="small"
                                    @click="QRcodeVisible = true" outlined>
                                    <Icon icon="ion:qr-code" width="20" height="20" />
                                    <div class="font-bold hidden sm:block">QR</div>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <!-- Middle part with dynamic content and controls -->
                    <div class="grid grid-cols-12 mb-4">
                        <div class="col-span-12 xl:col-span-12 mb-2">
                            <div class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold"
                                style="overflow-x: auto; white-space: no-wrap">
                                <Button :outlined="selectedService !== 'Dine in'" @click="selectService('Dine in')"
                                    class="min-w-[5rem] xl:min-w-[7rem]" size="small">Dine in</Button>
                                <Button :outlined="selectedService !== 'Take out'" @click="selectService('Take out')"
                                    class="min-w-[5rem] xl:min-w-[7rem]" size="small">Take out</Button>
                            </div>
                        </div>
                        <div class="col-span-12 xl:col-span-12 mb-2 overflow-auto px-5 "
                            style="max-height: calc(87vh - 250px)">
                            <Divider />

                            <div v-for="detail in orderDetails" :key="detail.id" class="mb-3 gap-2">
                                <div class="flex gap-2">
                                    <div class="font-bold text-xl self-center flex-grow">
                                        {{ detail.name }} <!-- Menu item name -->
                                    </div>
                                    <div class="self-center flex-wrap text-lg  text-end px-4">
                                        <div class="text-sm italic">
                                            Subtotal:
                                        </div>
                                        <div class="font-bold">{{ detail.subtotal }}</div>
                                        <!-- Price, assuming a currency filter -->
                                    </div>
                                </div>
                                <div class="flex gap-2 pt-2 justify-between">
                                    <div class="flex items-center w-1/3 h-full">
                                        <div class="text-sm mr-1 font-bold">
                                            Price:
                                        </div>
                                        <div class="text-base italic">
                                            P{{ detail.price }}
                                        </div>
                                    </div>
                                    <div style="width: 30%; height: 30px" class="">
                                        <Button severity="danger" class="w-full h-full" size="small"
                                            @click="removeOrderDetail(detail)">
                                            <div class="font-bold">Remove</div>
                                        </Button>

                                    </div>
                                    <div style="width: 40%;">

                                        <InputGroup class="w-full " style="height: 30px ">
                                            <Button severity="primary" size="small"
                                                @click="updateQuantity(detail, false)">
                                                <Icon icon="ic:sharp-minus" />
                                            </Button>
                                            <InputNumber v-model="detail.quantity" class="text-center justify-center"
                                                @update:modelValue="quantityChanged(detail, $event)" />
                                            <Button severity="primary" size="small"
                                                @click="updateQuantity(detail, true)">
                                                <Icon icon="ic:sharp-plus" />
                                            </Button>
                                        </InputGroup>


                                    </div>


                                </div>
                                <Divider />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Bottom part that should stay at the very bottom -->
                <div class="w-full">
                    <div class="flex-wrap mb-3 gap-2">
                        <div class="flex mb-3 border-t border-gray-500 pt-4">
                            <div class="flex justify-start px-4 ">
                                <span class="font-bold text-xl text-white self-center">Total Price</span>
                            </div>
                            <div class="flex-1 align-items-end text-end gap-2 align-self-end  ">
                                <span class="font-bold text-2xl pr-4">P {{ totalPrice }}</span>
                            </div>
                        </div>
                        <div class="flex justify-content-end">
                            <div class="flex-1 text-end">
                                <Button severity="warn" outlined icon="pi pi-window-minimize" class="mr-2" size="small"
                                    label="Hold Order" :disabled="!orderId"></Button>
                                <Button severity="success" icon="pi pi-wallet" label="Proceed to Payment"
                                    :disabled="!orderId" size="small" @click="paymentVisible = true">
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="block xl:hidden">
        <Drawer v-model:visible="visible" position="right">
            <div class="text-2xl font-bold">Order #1234</div>
            <div class="text-gray-300 italic">Customer Name</div>
            <div class="flex-grow overflow-auto h-[72%]">
                <!-- Top part of the card containing the order number and control buttons -->
                <div class="grid grid-cols-12 mb-4">
                    <div class="col-span-12 xl:col-span-5 mb-2">
                        <div class="flex flex-1 justify-start gap-2 font-bold">
                            <div class="text-2xl flex"></div>
                        </div>
                    </div>
                </div>
                <!-- Middle part with dynamic content and controls -->
                <div class="grid grid-cols-12 mb-4">
                    <div class="col-span-12 xl:col-span-12 mb-2">
                        <div class="flex gap-2 pb-3 text-sm xl:text-9xl font-bold"
                            style="overflow-x: auto; white-space: no-wrap">
                            <Button :outlined="selectedService !== 'Dine in'" @click="selectService('Dine in')"
                                class="min-w-[5rem] xl:min-w-[7rem]" size="small">Dine in</Button>
                            <Button :outlined="selectedService !== 'Take out'" @click="selectService('Take out')"
                                class="min-w-[5rem] xl:min-w-[7rem]" size="small">Take out</Button>
                        </div>
                    </div>
                    <div class="col-span-12 xl:col-span-12 mb-2">
                        <div class="flex mb-3 gap-2">
                            <div>Data Table content here</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Bottom part that should stay at the very bottom -->
            <div class="w-full">
                <div class="flex-wrap mb-3 gap-2">
                    <div class="flex mb-3">
                        <div class="flex justify-start px-4 bg-surface-500">
                            <span class="font-bold text-xl text-white self-center">Total Price</span>
                        </div>
                        <div class="flex-1 align-items-end text-end gap-2 align-self-end bg-green-100 text-black">
                            <span class="font-bold text-2xl pr-4">P 1000</span>
                        </div>
                    </div>
                    <div class="flex justify-content-center">
                        <div class="flex-1 text-end gap-2 justify-center flex">
                            <Button severity="warn" class="w-1/3 xl:w-auto">
                                <Icon icon="solar:minimize-square-3-outline" width="20" height="20" />
                                <div class="font-bold ">Hold</div>
                            </Button>
                            <Button severity="info" class="w-2/3 xl:w-auto">
                                <Icon icon="fluent:folder-24-filled" width="20" height="20" />
                                <div class="font-bold sm:block">All Orders</div>
                            </Button>

                        </div>

                    </div>
                    <div class="flex mt-2">
                        <Button class="w-full xl:w-auto" severity="success">
                            <Icon icon="ic:baseline-payments" width="20" height="20" />
                            <div class="font-bold">Payment</div>

                        </Button>
                    </div>
                </div>
            </div>
        </Drawer>
        <Button
            style="position: absolute; top: calc(50% - 2rem); right: 0; border-top-left-radius: 40%; border-bottom-left-radius: 40%"
            @click="visible = true">
            <Icon icon="ic:baseline-shopping-cart" width="30" height="40" />
        </Button>
    </div>

    <Dialog v-model:visible="allOrders" modal :style="{ width: '80vw', height: '100%' }" position="topright">


        <div class="flex">
            <!-- Using Tailwind CSS to manage the layout -->
            <div class="flex flex-col h-full w-3/5 ">
                <!-- Content area -->
                <div class="flex-grow overflow-auto p-4 h-[65vh] ">
                    <DataTable :value="filteredOrders" dataKey="id" selectionMode="single" metaKeySelection="false"
                        v-model:selection="selectedOrder" @row-click="handleRowClick">
                        <!-- <Column expander style="width: 3rem"></Column> -->
                        <Column field="id" header="ID">
                        </Column>
                        <Column field="order_date" header="Order Date">
                            <template #body="slotProps">
                                {{ formatDate(slotProps.data.order_date) }}
                            </template>
                        </Column>
                        <Column field="customer_name" header="Customer">
                            <template #body="slotProps">
                                {{ slotProps.data.customer_name ? slotProps.data.customer_name : 'no data' }}
                            </template>
                        </Column>
                        <Column field="service" header="Service"></Column>
                        <Column field="total_price" header="Total Price" :body="formatCurrency"></Column>
                        <Column field="status" header="Status">
                            <template #body="slotProps">
                                <Tag :value="slotProps.data.status" :severity="statusSeverity(slotProps.data)" />

                            </template>
                        </Column>
                        <!-- <template #expansion="orderData">
                        <DataTable :value="orderData.data.details" class="mt-2 ">
                            <Column field="menu_name" header="Item Name"></Column>
                            <Column field="menu_price" header="Item Price" :body="formatCurrency"></Column>
                            <Column field="quantity" header="Quantity"></Column>
                            <Column field="subtotal" header="Subtotal" :body="formatCurrency"></Column>
                        </DataTable>
                    </template> -->
                    </DataTable>

                </div>

                <!-- Footer stays at the bottom -->
                <div class="p-4 border-t mt-auto flex justify-end gap-2 mr-5">
                    <Button label="Close" outlined severity="secondary" @click="allOrders = false" />
                    <Button label="Cancel Order" outlined severity="danger" @click="cancelOrder()" />
                    <Button label="Go to Order" severity="info" @click="goToOrder()" />
                </div>
            </div>



            <Divider layout="vertical" />
            <div class="flex flex-col h-full w-2/5 ">
                <div class="flex-grow overflow-auto p-4 h-[65vh] ">
                    <DataTable v-if="selectedOrder && selectedOrder.details" :value="selectedOrder.details"
                        class="mt-2">
                        <Column field="menu_name" header="Item Name"></Column>
                        <Column field="menu_price" header="Item Price" :body="formatCurrency"></Column>
                        <Column field="quantity" header="Quantity"></Column>
                        <Column field="subtotal" header="Subtotal" :body="formatCurrency"></Column>
                    </DataTable>


                </div>
            </div>

        </div>
    </Dialog>
    <Dialog v-model:visible="allCustomers" modal :style="{ width: '60vw', height: '80%' }" position="top">
        <!-- <div v-for="customer in customers" :key="customer.id">
            <div class="flex">
                <div>Pic</div>
                <div>{{ customer.firstname }}</div>
                <div>{{ customer.lastname }}</div>
            </div>
            <Divider />
        </div> -->
        <DataTable :value="customers">
            <Column field="pic" header="Pic">
                <template #body="slotProps">
                    <img :src="slotProps.data.imagePath || defaultProfilePic" alt="Profile Pic" class="profile-pic"
                        style="width: 50px; height: 50px;">
                </template>
            </Column>
            <Column field="firstname" header="First Name"></Column>
            <Column field="lastname" header="Last Name"></Column>
        </DataTable>
    </Dialog>

    <Dialog v-model:visible="QRcodeVisible" modal :style="{ width: '20vw', height: '35%' }" position="center"
        header="Order QR Code">

        <div class="flex w-full">
            <InputGroup>

                <InputGroupAddon>
                    <Icon icon="bx:qr-scan" width="20" height="20" />
                </InputGroupAddon>
                <InputGroupAddon>AIVR</InputGroupAddon>
                <InputText v-model="QRcode" placeholder="00000" />
            </InputGroup>
        </div>
        <div class="italic mt-2 text-light text-sm">
            <span class="italic mt-2 text-light text-sm">Enter the code from the customer to get their order or scan the
                QR code. </span> <span class="text-red-500">&nbspSoon there will be a scanner for computers but for now,
                use
                phone's camera.</span>
        </div>
        <div class="flex justify-end gap-2 mt-4">
            <Button severity="secondary" outlined @click="QRcodeVisible = false"> Cancel</Button>
            <Button severity="success" @click="confirmOrder">Get Order</Button>
        </div>
    </Dialog>

    <Dialog v-model:visible="endSessionVisible" modal :style="{ width: '20vw', height: '30%' }" position="center"
        header="End the current session?">

        <div class="flex-wrap w-full pb-2 font-bold mt-2">
            <div>
                Total Money in the Register:
            </div>
            <div class="text-3xl flex">
                P{{ totalCash }}
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <Button severity="secondary" outlined @click="endSessionVisible = false"> Cancel</Button>
            <Button severity="danger" @click="endSession()">Close Session</Button>
        </div>
    </Dialog>

    <Dialog v-model:visible="cameraVisible" modal :style="{ width: '50vw', height: '55%' }" position="center"
        header="Scan Order QR Code">

        <div class="qr-reader">
            <qrcode-stream v-if="cameraActive" :formats="['qr_code']" @detect="onDetect" @camera-on="onCameraOn"
                @error="onError">
            </qrcode-stream>
        </div>



    </Dialog>

    <Dialog v-model:visible="printVisible" modal :style="{ width: '20vw', height: 'auto' }" position="center"
        :header="'Order #' + orderId">

        <div class="gap-2 flex w-full font-bold">
            <Button class="w-full" severity="info" outlined>
                Download pdf
            </Button>
            <Button class="w-full" severity="success" @click="printOrder">
                Print
            </Button>
        </div>

    </Dialog>
    <div class="receipt" v-if="printVisible">
        <div class="receipt-content">
            <!-- Center the logo using a flex container -->
            <div style="display: flex; justify-content: center; width: 100%;">
                <img src="@/assets/pics/receiptlogo.png" alt="Barangay Balite Logo" style="max-width: 200px;">
                <!-- Ensure the image size is appropriate -->
            </div>
            <h2 style="text-align: center;   font-size: 15px;">
                Barangay Balite, Calapan City,<br> Oriental Mindoro, 5200
            </h2>
            <h3 style="text-align: center;   font-size: 20px;"><strong>Order #:</strong> {{ orderId }}</h3>

            <!-- Fix and style the date and time layout -->
            <div
                style="display: flex; justify-content: space-between; padding: 0 10px;   font-size: 15px; font-style: italic">
                <p> {{ new Date().toLocaleDateString() }}</p>
                <p> {{ new Date().toLocaleTimeString() }}</p> <!-- Display current time -->
            </div>

            <div v-for="item in orderDetails" :key="item.id">
                <div style="justify-content: space-between; display: flex; padding: 0 15px; ">
                    <div>
                        <div>
                            {{ item.name }}
                        </div>
                        <div>
                            {{ item.quantity }} X {{ item.price }}
                        </div>
                    </div>
                    <div style="font-weight: bold; font-size: 16px">
                        {{ item.subtotal }}
                    </div>
                </div>
            </div>
            <div style="display: flex; font-weight: bold; justify-content: space-between; font-size: 18px">
                <h3 style=" text-align: center;">Total: </h3>
                <div>P{{ totalPrice }}.00</div>
            </div>
        </div>
    </div>

</template>

<style>
.item-border {
    border: 2px solid #a7af4c;
    padding: 2px;
}

.scroll-container {
    scroll-behavior: smooth;
}

.profile-pic {
    border-radius: 50%;
    /* Circular images */
    border: 3px solid #00ff6e;
    /* Optional: adds a border around the image */
}

.qr-reader {
    position: relative;
    width: 100%;
    height: 400px;
}

@media print {
    body * {
        visibility: hidden;
        margin: 0;
        padding: 0;
    }

    .receipt,
    .receipt * {
        visibility: visible;
        color: #000;
        /* Pure black */
        background-color: #fff;
        /* Pure white */
    }

    .receipt {
        position: absolute;
        left: 0;
        top: 0;
        width: 55mm;
        padding: 5mm;
        font-size: 12px;
        /* Larger font size for better readability */
        line-height: 1.5;
        /* Improved line spacing */
    }

    .receipt-content h1,
    .receipt-content h2,
    .receipt-content h3,
    .receipt-content p,
    .receipt-content ul {
        margin: 1mm 0;
    }

    .receipt-content ul {
        padding-left: 5mm;
        list-style-type: none;
        /* No bullets */
    }
}
</style>