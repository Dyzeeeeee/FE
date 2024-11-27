<script setup>
import { baseImageUrl } from '@/config'; // Make sure the path is correct based on your project structure
import axios from "axios";
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const activeNoteId = ref(null);
const activeAddNoteId = ref(null);
const customerTagForBatchPayment = ref(null);  // Store the customer tag for batch payment
const batchPaymentVisible = ref(false);  // Toggle state for batch payment drawer
const toggleBatchPayment = (customerTag) => {
    allOrdersVisible.value = false;
    customerTagForBatchPayment.value = customerTag;  // Store the selected customer tag
    batchPaymentVisible.value = !batchPaymentVisible.value;  // Toggle the batch payment visibility
};

const closeCustomer = (customerTag) => {
    // Find the customer orders using the customerTag
    const customerOrders = ordersTodayGroupedByCustomer.value.find(order => order.customerTag === customerTag);

    if (!customerOrders) {
        console.error("Customer orders not found.");
        return;
    }

    // Check if there is any order with a status of 'pending'
    const hasPendingOrder = customerOrders.orders.some(order => order.status == 'pending');

    if (hasPendingOrder) {
        // Use toast.add to show a notification
        toast.add({
            severity: 'warn', // Severity type: 'info', 'warn', 'success', 'error', etc.
            summary: 'Action Blocked',
            detail: 'Cannot close customer. There are orders with a pending status.',
            life: 3000 // Duration in milliseconds
        });
        return;
    }

    // Update the 'completed' field for each order to '1'
    customerOrders.orders.forEach(order => {
        order.completed = '1'; // Set the completed status to '1'
    });

    // Optionally, trigger a batch update if needed (e.g., send the data to the server)
    batchUpdateOrders(customerOrders.orders);

    // Close the customer view dialog
    allOrdersVisible.value = false;
};


// Method to send the updated orders to the server (batch update)
const batchUpdateOrders = (orders) => {
    axios.post('/batch-update-orders', { orders })
        .then(response => {
            console.log("Orders updated successfully:", response);
        })
        .catch(error => {
            console.error("Error updating orders:", error);
        });
};


const totalOrderAmountForCustomer = computed(() => {
    return selectedCustomerOrders.value.reduce((total, order) => {
        // Only add the total_price if the order status is "pending"
        if (order.status === 'pending') {
            return total + parseFloat(order.total_price) || 0;
        }
        return total;  // If not "pending", return the current total without changes
    }, 0);
});


const selectedCustomerOrders = computed(() => {
    const customer = ordersTodayGroupedByCustomer.value.find(
        (group) => group.customerTag === customerTagForBatchPayment.value
    );
    return customer ? customer.orders : [];  // Return orders for the selected customer
});
const toggleNoteVisibility = (detailId) => {
    activeNoteId.value = activeNoteId.value === detailId ? null : detailId;
};
const toggleAddNoteVisibility = (detailId) => {
    activeAddNoteId.value = activeAddNoteId.value === detailId ? null : detailId;
};

const isNoteVisible = (detailId) => {
    return activeNoteId.value === detailId;
};
const newNoteText = ref(null)
const isAddNoteVisible = (detailId) => {
    return activeAddNoteId.value === detailId;
};

const editNote = ref({});  // Store the edited notes for each item
const activeEditingId = ref(null);  // Store the id of the note being edited

// Toggle editing state for a specific note
const editNoteField = (detailId) => {
    activeEditingId.value = detailId;  // Set the item id as the active editing id
    editNote.value[detailId] = orderDetails.value.find(detail => detail.menu_item_id === detailId).note;  // Pre-fill the note for editing
};

// Check if the note is being edited for a given item
const isEditingNote = (detailId) => {
    return activeEditingId.value === detailId;
};

const addOrderForCustomer = async (customerTag) => {
    try {
        const response = await axios.post('/add-order', {
            session_id: 1,
            customer_id: sessionStorage.getItem('userId'),
            customer_tag: customerTag // Pass the customerTag in the request
        });

        if (response.data && response.data.id) {
            orderId.value = response.data.id;  // Set the newly created order ID in the reactive reference
            selectedCustomer.value = customerTag;  // Set the newly created order ID in the reactive reference
            localStorage.setItem('orderId', orderId.value);  // Store the order ID in localStorage
            localStorage.setItem('customer_tag', customerTag);  // Store the order ID in localStorage

            console.log('Order ID:', orderId.value); // Logging the order ID

        }
        allOrdersVisible.value = false;
        await getOrderDetails();
        await getAllOrders();
        orderVisible.value = true;
        console.log('Order added:', response.data);
    } catch (error) {
        console.error('Error adding order:', error);
    }
};


// Save the edited note
const saveNote = async (itemId, newNote) => {
    try {
        // Find the item in the order details by its menu_item_id
        const item = orderDetails.value.find(detail => detail.menu_item_id === itemId);
        if (item) {
            // Ensure the note is not empty
            if (!newNote || newNote.trim() === "") {
                console.log("Note cannot be empty.");
                return;
            }

            // Update the item with the new note
            item.note = newNote;

            // Send the updated note to the backend
            await axios.post('/add-or-update-order-detail', {
                order_id: orderId.value,
                menu_item_id: itemId,
                note: item.note
            });

            console.log(`Note for item ID ${itemId} updated: ${item.note}`);

            // Hide the note input and the "Add Note" section after saving
            // Reset activeEditingId and activeAddNoteId specifically for the current item
            activeEditingId.value = null;  // Hide the input by resetting the activeEditingId for this item
            activeAddNoteId.value = null;  // Hide the "Add Note" section after saving the note
            activeNoteId.value = null;  // Hide the "Add Note" section after saving the note

            // You may also want to reset the newNoteText here
            newNoteText.value = '';  // Clear the new note input field after saving
        }
    } catch (error) {
        console.error('Error saving note:', error);
    }
};







const itemStatus = ref(false);
const categories = ref([]);
const selectedCategoryId = ref('All');  // Initially set to 'All'
const allMenuItems = ref([]);  // Holds all menu items unfiltered
const menuItems = ref([]);
const isRounded = ref(true);
const searchTerm = ref(''); // Reactive variable for search term
const selectedItemId = ref(null); // Track the currently selected item
const showCategories = ref(true);
const showOrders = ref(false);
const props = defineProps(['orderId']);
const orderId = ref(props.orderId); // Assign the prop to the reactive variable
console.log('Props Order ID:', props.orderId);
if (orderId.value) {
    localStorage.setItem('orderId', props.orderId);
    console.log('Order ID stored in localStorage:', orderId.value);
}
const detailsVisible = ref(false);
const orderDetailsPerCustomer = ref(false);
const paymentVisible = ref(false);
const selectedService = ref('Dine in'); // Default selection
const ordersToday = ref([]);
const ordersTodayGroupedByCustomer = computed(() => {
    const grouped = {};

    ordersToday.value.forEach(order => {
        if (order.customer_tag && order.completed === '0') { // Only process if completed is 0
            if (order.status === "paid") {
                if (!grouped[order.customer_tag]) {
                    grouped[order.customer_tag] = {
                        customerTag: order.customer_tag,
                        totalAmount: 0,
                        orders: []
                    };
                }
                // Add to orders, but don't affect totalAmount
                grouped[order.customer_tag].orders.push(order);
            } else {
                // For non-pending orders, update totalAmount
                if (!grouped[order.customer_tag]) {
                    grouped[order.customer_tag] = {
                        customerTag: order.customer_tag,
                        totalAmount: 0,
                        orders: []
                    };
                }
                // Parse total_price to ensure correct numeric addition
                grouped[order.customer_tag].totalAmount += parseFloat(order.total_price) || 0;
                grouped[order.customer_tag].orders.push(order);
            }
        }
    });

    // Filter out customers with a totalAmount of 0 and completed status as 0
    return Object.values(grouped).filter(group => group.totalAmount > 0 || group.orders.length > 0);
});





const visibleCustomerOrders = ref({});

function toggleCustomerOrders(customerTag) {
    visibleCustomerOrders.value[customerTag] = !visibleCustomerOrders.value[customerTag];
}

function isCustomerOrdersVisible(customerTag) {
    return visibleCustomerOrders.value[customerTag];
}

function getStatusColor(status) {
    return status === 'pending' ? 'text-orange-400' : 'text-green-400';
}


const selectedOrder = ref(null);

const viewOrderDetails = (orderId) => {
    // Find the selected order from your orders data
    selectedOrder.value = ordersToday.value.find(order => order.id === orderId);
    orderDetailsPerCustomer.value = true; // Open the drawer
};

function selectService(service) {
    selectedService.value = service;
}

const failedImages = ref({}); // Object to track failed image status for each item
const toggleItem = (itemId) => {
    // Toggle the currently selected item
    selectedItemId.value = selectedItemId.value === itemId ? null : itemId;
};

const totalUniqueItems = computed(() => orderDetails.value.length);

const toast = useToast();

function showDetails(item) {
    selectedItem.value = item;
    detailsVisible.value = true;
}
const selectedItem = ref(null);


const deleteNote = async (itemId) => {
    try {
        const item = orderDetails.value.find(detail => detail.menu_item_id === itemId);
        if (item) {
            // Send the request to the backend to delete the note
            await axios.post('/delete-note', {
                order_id: orderId.value,
                menu_item_id: itemId
            });

            // Clear the note locally
            item.note = null;

            // Hide the active note by resetting the active note state (e.g., activeEditingId)
            activeEditingId.value = null;  // Hide the input by resetting the activeEditingId for this item
            activeAddNoteId.value = null;  // Hide the "Add Note" section after saving the note
            activeNoteId.value = null;
            newNoteText.value = '';  // Clear the new note input field after saving

            console.log(`Note for item ID ${itemId} deleted successfully.`);
        }
    } catch (error) {
        console.error('Failed to delete the note:', error);
    }
};



const incrementQuantity = async (itemId) => {
    try {
        const item = orderDetails.value.find(detail => detail.menu_item_id === itemId);
        if (item) {
            item.quantity = parseInt(item.quantity, 10) + 1;  // Increment quantity with parseInt
            item.subtotal = parseFloat(item.price) * item.quantity;  // Update subtotal as a float

            // Update the order detail in the backend
            await axios.post('/add-or-update-order-detail', {
                order_id: orderId.value,
                menu_item_id: itemId,
                quantity: item.quantity,
                subtotal: item.subtotal
            });

            console.log(`Increased quantity for item ID ${itemId} to ${item.quantity}`);
        }
    } catch (error) {
        console.error('Error incrementing quantity:', error);
    }
};

const decrementQuantity = async (itemId) => {
    const item = orderDetails.value.find(detail => detail.menu_item_id === itemId);
    if (item) {
        if (parseInt(item.quantity, 10) === 1) {
            // If quantity is 1, call removeItem instead
            await removeItem(item);
        } else {
            // Decrement the quantity and update backend
            item.quantity = parseInt(item.quantity, 10) - 1;
            item.subtotal = parseFloat(item.price) * item.quantity;

            // Update the order detail in the backend
            await axios.post('/add-or-update-order-detail', {
                order_id: orderId.value,
                menu_item_id: itemId,
                quantity: item.quantity,
                subtotal: item.subtotal
            });
        }
    }
};

const removeItem = async (detail) => {
    try {
        const response = await axios.delete(`/delete-order-detail/${detail.id}`);
        if (response.status === 200) {
            // Remove the item from orderDetails in the frontend
            orderDetails.value = orderDetails.value.filter(d => d.menu_item_id !== detail.menu_item_id);
            console.log(`Item with ID ${detail.menu_item_id} removed successfully.`);
        }
    } catch (error) {
        console.error('Error removing item:', error);
    }
};

const totalOrderAmount = computed(() => {
    return orderDetails.value.reduce((acc, item) => acc + item.price * item.quantity, 0);
});




const handleImageError = (itemId) => {
    failedImages.value[itemId] = true; // Mark the specific item as failed
};
const filteredMenuItems = computed(() => {
    const lowerCasedSearchTerm = searchTerm.value.toLowerCase();
    return allMenuItems.value.filter(item => {
        const matchesCategory = selectedCategoryId.value === 'All' || item.category_id === selectedCategoryId.value;
        const matchesSearch = item.name.toLowerCase().includes(lowerCasedSearchTerm);
        return matchesCategory && matchesSearch;
    }).reduce((uniqueItems, item) => {
        if (!uniqueItems.some(i => i.id === item.id)) {
            uniqueItems.push(item);
        }
        return uniqueItems;
    }, []);
});


const orderItemCount = computed(() => orderDetails.value.length);


const filterCategory = (categoryId) => {
    selectedCategoryId.value = categoryId;  // Update the selected category ID
    menuItems.value = categoryId === 'All'
        ? allMenuItems.value
        : allMenuItems.value.filter(item => item.category_id === categoryId);
};

const orders = ref([]);

// Fetch orders from the backend
const getAllOrders = async () => {
    try {
        const response = await axios.get('/get-orders'); // Replace with the actual API endpoint
        if (response.data) {
            orders.value = response.data;
            filterOrdersForToday(); // Filter orders for today
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

// Filter orders that belong to today
const filterOrdersForToday = () => {
    const today = new Date();
    console.log("Today's Date:", today); // Log today's date for comparison

    ordersToday.value = orders.value.filter(order => {
        const orderDate = new Date(order.updated_at); // Assuming your order has an `updated_at` field
        console.log("Order Date:", orderDate); // Log the order date being checked

        const isSameDay = orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear();

        console.log("Is same day:", isSameDay); // Log if the order is from today

        return isSameDay;
    });

    console.log("Orders for Today:", ordersToday.value); // Log the filtered orders
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

const handleScroll = () => {
    if (window.scrollY > 50) {
        isRounded.value = false;
    } else {
        isRounded.value = true;
    }
}; onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    getAllOrders();
    orderId.value = localStorage.getItem('orderId');
    selectedCustomer.value = localStorage.getItem('customer_tag');
    getOrderDetails();

});
const getItemQuantity = (itemId) => {
    const detail = orderDetails.value.find(d => d.menu_item_id === itemId);
    return detail ? detail.quantity : 0;  // Return the quantity if found, otherwise 0
};

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
const userData = ref([]);
const getUserById = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.error('No user ID found in session storage');
        return;
    }

    try {
        const response = await axios.get(`/get-user/${userId}`);
        if (response.data) {
            userData.value = response.data;
            console.log('User data fetched:', userData.value);
        } else {
            console.error('No data returned for user');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

const customerList = ref([
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'
]);



const customerVisible = ref(false);

const selectedCustomer = ref(localStorage.getItem('customer') || '');

const newCustomer = ref(''); // The customer input value

const addCustomer = () => {
    if (newCustomer.value && !customerList.value.includes(newCustomer.value)) {
        customerList.value.push(newCustomer.value);
        newCustomer.value = ''; // Clear input after adding
    }
};

const selectCustomer = (customer) => {
    selectedCustomer.value = customer;
    localStorage.setItem('customer', selectedCustomer.value);
    // Set the selected customer
    customerVisible.value = false; // Close dialog after selection
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

// Interval to update the date components every minute
onMounted(async () => {
    getUserById();
    getCategories();
    getMenu();
    getOrderDetails();
    if (localStorage.getItem('orderVisible') === 'true') {
        orderVisible.value = true;
        // Remove it from localStorage if needed, so it's only triggered once
        localStorage.removeItem('orderVisible');
    }
});
const isItemAdded = (itemId) => {
    return orderDetails.value.some(detail => detail.menu_item_id === itemId);
};

const goToOrder = async (orderId) => {
    // Save the orderId to localStorage (make sure you use the correct method)
    localStorage.setItem('orderId', orderId);
    // console.log('test', selectedOrder.value.customer_tag);
    selectedCustomer.value = selectedOrder.value.customer_tag;
    // Fetch and set the selected order details
    selectedOrder.value = await getOrderDetails(orderId);

    // Show the drawer with the fetched order details
    orderDetailsPerCustomer.value = false;
    orderVisible.value = true;
    allOrdersVisible.value = false;
};

const goToPayment = async (orderId) => {
    // Save the orderId to localStorage (make sure you use the correct method)
    localStorage.setItem('orderId', orderId);
    // console.log('test', selectedOrder.value.customer_tag);
    selectedCustomer.value = selectedOrder.value.customer_tag;
    // Fetch and set the selected order details
    selectedOrder.value = await getOrderDetails(orderId);

    // Show the drawer with the fetched order details
    orderDetailsPerCustomer.value = false;
    paymentVisible.value = true;
    allOrdersVisible.value = false;
};




const generateRandomQR = () => {
    const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    text.value = `AIVR${randomNumber}`;
    localStorage.setItem('qrCode', text.value);
}


const text = ref(localStorage.getItem('qrCode') || 'AIVR12345');

const orderVisible = ref(false);

const showOrderDetails = () => {
    orderVisible.value = true;
    detailsVisible.value = false;
};

watch(orderVisible, (newValue) => {
    if (newValue) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
});
watch(detailsVisible, (newValue) => {
    if (newValue) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
});

const createOrder = async (userId) => {
    try {
        const response = await axios.post('/add-order', { session_id: 1, customer_id: sessionStorage.getItem('userId') });
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

const orderDetails = ref([]);

const loading = ref(false);

const addToOrder = async (menuItem) => {
    loading.value = true; // Start loading indicator
    const userId = sessionStorage.getItem('userId');
    orderId.value = localStorage.getItem('orderId');

    if (!orderId.value) {
        orderId.value = await createOrder(userId);
    }

    if (orderId.value) {
        try {
            const orderDetailsResponse = await axios.get(`/get-order-details/${orderId.value}`);
            orderDetails.value = orderDetailsResponse.data;

            const existingItem = orderDetails.value.find(detail => detail.menu_item_id === menuItem.id);

            let orderDetail = {
                order_id: orderId.value,
                menu_item_id: menuItem.id,
                quantity: 1,
                subtotal: menuItem.price
            };

            if (existingItem) {
                orderDetail.quantity = parseInt(existingItem.quantity, 10) + 1;
                orderDetail.subtotal = parseFloat(menuItem.price) * orderDetail.quantity;
            }

            const response = await axios.post('/add-or-update-order-detail', orderDetail);
            console.log('Item added/updated in order:', response.data);

            // Manually update orderDetails value to reflect the new quantity
            if (existingItem) {
                existingItem.quantity = orderDetail.quantity;
                existingItem.subtotal = orderDetail.subtotal;
            } else {
                orderDetails.value.push(orderDetail); // Add the new item if it didn't exist
            }

            // toast.add({
            //     severity: 'success',
            //     summary: 'Success',
            //     detail: `Item ${menuItem.name} added to the order successfully!`,
            //     life: 2000
            // });

            getOrderDetails(); // Refresh the order details if needed
        } catch (error) {
            console.error('Error adding/updating item in order:', error);
        } finally {
            loading.value = false; // Ensure loading is stopped after completion
        }
    } else {
        console.error('No order ID found, cannot add/update item in order.');
        loading.value = false; // Stop loading if no order ID
    }
};
const allOrdersVisible = ref(false);


const getOrderDetails = async () => {
    try {
        orderId.value = localStorage.getItem('orderId');

        const response = await axios.get(`/get-order-details/${orderId.value}`);
        if (response && response.data) {
            orderDetails.value = response.data.map(item => ({
                ...item,
                imageUrl: `${baseImageUrl}${encodeURIComponent(item.image)}`
            }));
            console.log('Details fetched:', orderDetails.value);
        } else {
            console.error('No data received from the server');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};


const confirmedStatus = ref('sent');

const confirmPayment = async () => {
    if (!selectedCustomer.value) {
        // Show toast notification if no customer tag is selected

        toast.add({ severity: 'warn', summary: 'Warning', detail: 'No customer tag selected', life: 3000 });
        return;
    }
    try {
        // Data to be sent in the update request
        const paymentData = {
            tendered: amountTendered.value,
            customer_tag: selectedCustomer.value,
            total_price: totalOrderAmount.value,
            service: selectedService.value,
            service: selectedService.value,
            payment_method: selectedPaymentMethod.value,
            change1: changeDue.value,
            status: 'paid'  // Set status to 'paid'
        };

        // Make the PUT request to update the order
        const response = await axios.put(`/update-order/${orderId.value}`, paymentData);

        if (response.status === 200) {
            // Handle successful response (e.g., show success message)
            console.log('Order updated successfully');
        }

        await createOrder();
        await getOrderDetails();
        await getAllOrders();
        selectedCustomer.value = null;
        orderVisible.value = false;
        paymentVisible.value = false;
    } catch (error) {
        // Handle error response
        console.error('Error updating order:', error);
    }
};



const confirmOrder = async () => {
    if (!selectedCustomer.value) {
        // Show toast notification if no customer tag is selected

        toast.add({ severity: 'warn', summary: 'Warning', detail: 'No customer tag selected', life: 3000 });
        return;
    }

    try {
        const response = await axios.put(`/update-order/${orderId.value}`, {
            total_price: totalOrderAmount.value,
            customer_tag: selectedCustomer.value,
            service: selectedService.value,
            confirmed: confirmedStatus.value
        });

        const userId = sessionStorage.getItem('userId');
        orderId.value = localStorage.getItem('orderId');
        if (response.status === 200) {
            if (orderId.value) {
                orderId.value = await createOrder(userId);
            }

            orderDetails.value = [];
            selectedCustomer.value = null;
            orderVisible.value = false;
            console.log('Order confirmed successfully', response.data);
            // toast.add({ severity: 'success', summary: 'Order sent to kitchen', detail: 'Order is now being prepared', life: 3000 });
            await getAllOrders();

        } else {
            console.error('Failed to confirm order');
        }
    } catch (error) {
        console.error('Error confirming order:', error);
    }
};


const amountTendered = ref(0);
const changeDue = ref(totalOrderAmount.value); // Initially set to the total order amount
const batchChangeDue = ref(totalOrderAmountForCustomer.value); // Initially set to the total order amount
const selectedPaymentMethod = ref('Cash');

// Method to handle clearing the input
const clearAmount = () => {
    amountTendered.value = 0;
};

// Method to set the amount to the exact change due
const setExactAmount = () => {
    amountTendered.value = totalOrderAmount.value;
};

// Method to handle adding amounts quickly (e.g., P1, P5, P10)
const addAmount = (value) => {
    amountTendered.value += value;
};

const batchClearAmount = () => {
    amountTendered.value = 0;
};

// Method to set the amount to the exact change due
const batchSetExactAmount = () => {
    amountTendered.value = totalOrderAmountForCustomer.value;
};

// Method to handle adding amounts quickly (e.g., P1, P5, P10)
const batchAddAmount = (value) => {
    amountTendered.value += value;
};

// Method to confirm the payment
watch([amountTendered, totalOrderAmount], () => {
    if (amountTendered.value >= totalOrderAmount.value) {
        // Calculate change if tendered amount is more than due
        changeDue.value = amountTendered.value - totalOrderAmount.value;
        paymentStatus.value = 'change';  // Set payment status to 'change'
    } else {
        // Calculate due if tendered amount is less than the total order amount
        changeDue.value = totalOrderAmount.value - amountTendered.value;
        paymentStatus.value = 'due';  // Set payment status to 'due'
    }
});

// Method to confirm the payment
watch([amountTendered, totalOrderAmountForCustomer], () => {
    if (amountTendered.value >= totalOrderAmountForCustomer.value) {
        // Calculate change if tendered amount is more than due
        batchChangeDue.value = amountTendered.value - totalOrderAmountForCustomer.value;
        paymentStatus.value = 'change';  // Set payment status to 'change'
    } else {
        // Calculate due if tendered amount is less than the total order amount
        batchChangeDue.value = totalOrderAmountForCustomer.value - amountTendered.value;
        paymentStatus.value = 'due';  // Set payment status to 'due'
    }
});

// Computed property or variable to manage the payment status
const paymentStatus = ref('due');  // Default status is 'due'

// Watch the status to update display (for example, 'Change/Due' label)




// Sample method to handle payment method selection
const selectPaymentMethod = (method) => {
    selectedPaymentMethod.value = method;
};



const confirmPaymentForCustomer = () => {
    // Ensure there is a valid amount tendered
    if (!amountTendered.value || amountTendered.value <= 0) {
        return;
    }

    const totalDue = batchChangeDue.value;
    const remainingAmount = amountTendered.value - totalDue;

    // Check if selectedCustomerOrders is an array
    if (!Array.isArray(selectedCustomerOrders.value)) {
        console.error('selectedCustomerOrders is not an array');
        return;
    }

    // Filter the orders with 'pending' status
    const pendingOrders = selectedCustomerOrders.value.filter(order => order.status === 'pending');

    // If there are no pending orders
    if (pendingOrders.length === 0) {
        alert("No pending orders to process.");
        return;
    }

    // If the total amount tendered is less than the total due, prevent payment
    if (amountTendered.value < totalDue) {
        alert("Insufficient payment.");
        return;
    }

    let remainingAmountToTender = remainingAmount;  // Start with the change that needs to be allocated

    // Prepare the simplified order data for the request body
    const updatedOrders = pendingOrders.map((order, index) => {
        const orderDueAmount = parseFloat(order.total_price);
        let amountForThisOrder = orderDueAmount;

        // If there's remaining change to allocate
        if (remainingAmountToTender > 0) {
            if (index === pendingOrders.length - 1) {
                // Last order: allocate the remaining change to this order
                amountForThisOrder = amountTendered.value - remainingAmountToTender + orderDueAmount;
                order.change1 = amountTendered.value - remainingAmountToTender; // Assign remaining change to last order
                remainingAmountToTender = 0;  // Reset remaining change
            } else {
                // Non-last orders: only tender the amount due
                order.change1 = 0;  // No change for non-last orders
            }
        }

        // Update the order with the allocated amount
        order.tendered = amountForThisOrder;
        order.status = 'paid'; // Change the order status to 'paid'

        // Return only the necessary fields for the API call
        return {
            id: order.id,
            tendered: order.tendered,
            change1: order.change1, // Either 0 or the allocated change
            status: order.status,
        };
    });

    // Update the selectedCustomerOrders with the newly allocated payment details
    selectedCustomerOrders.value = [...selectedCustomerOrders.value];
    console.log("Updated Orders to Send: ", updatedOrders);

    // Call an API or method to persist the payment changes
    updateOrdersWithPayment(updatedOrders);

    // Handle any UI feedback or state reset if needed
    paymentStatus.value = 'paid';  // Update payment status
    batchPaymentVisible.value = false; // Close the payment drawer
};





const updateOrdersWithPayment = (updatedOrders) => {
    // Assuming you have an API endpoint that handles updating the orders
    axios.post('/batch-update-orders', { orders: updatedOrders })
        .then(response => {
            console.log('Orders updated successfully');
        })
        .catch(error => {
            console.error('Error updating orders:', error);
        });
};







</script>

<template>
    <Toast />
    <div class="grid grid-cols-12 xl:gap-3 gap-1 -mx-5 xl:-mx-3 "  :class="{
        'mt-24': showCategories,
        'mt-12': !showCategories,
        'mb-20': orderItemCount > 0,
        'mb-10': orderItemCount === 0
    }">
        <div class="col-span-12 xl:col-span-12 items-center bg-surface-800"
            :class="['fixed xl:static top-0 left-0 right-0 z-50', isRounded ? 'mt-2 p-2 shadow-md transition-all duration-300 ease-in-out' : ' top-0 bg-gray-800  p-2 transition-all duration-300 ease-in-out shadow-lg ']">
            <div class="flex gap-2 font-bold">
                <div class="flex gap-2 w-[35%]">
                    <div
                        class="rounded-full text-lgs font-bold h-[2rem] w-[33%] self-center flex justify-center items-center flex-col bg-whste text-white-500 border-white-500">
                        <Icon icon="ic:sharp-menu-book" height="25" />
                    </div>
                    <div @click="allOrdersVisible = true"
                        class="rounded-full text-lgs font-bold h-[2rem] w-[33%] self-center flex justify-center items-center flex-col bg-whste text-white-500 border-white-500">
                        <Icon icon="material-symbols:pending-actions" height="25" />

                    </div>
                    <div v-if="!selectedCustomer" @click="customerVisible = true"
                        class="rounded-full text-lgs font-bold h-[2rem] w-[33%] self-center flex justify-center items-center flex-col bg-whste text-white-500 border-white-500">
                        <Icon icon="mdi:user-add" height="25" />
                    </div>
                    <div v-else
                        class="rounded-xl border-[1px] text-lg font-bold h-[2.5rem] w-[33%] self-center flex justify-center items-center text-black font-bold bg-white border-whites"
                        @click="customerVisible = true">
                        {{ selectedCustomer }}
                    </div>

                </div>
                <!-- <div class="flex-1">

                </div> -->
                <div class="flex justify-end w-[65%] self-center">
                    <InputText v-model="searchTerm" placeholder="Search the menu" class="w-full h-[2.5rem]" />
                </div>
            </div>
            <div class="relative flex items-center w-full mt-2 "
                :class="showCategories ? 'flex gap-2 overflow-x-auto' : 'hidden'">
                <Icon icon="fe:arrow-left" width="50" height="50" @click="scrollToLeft"
                    class="cursor-pointer pb-2  hidden xl:block" />
                <div ref="scrollContainer"
                    class="flex gap-2 pb-0 text-sm xl:text-9xl font-bold relative overflow-x-auto whitespace-nowrap"
                    style="scrollbar-width: none; -ms-overflow-style: none;">

                    <button @click="filterCategory('All')"
                        :class="['min-w-[5rem] xl:min-w-[7rem] rounded-xl px-4 py-2 text-sm font-semibold', selectedCategoryId === 'All' ? 'bg-white text-black font-bold' : 'bg-transparent border  border-white text-white']">
                        All
                    </button>

                    <button v-for="category in categories" :key="category.id" @click="filterCategory(category.id)"
                        :class="['w-auto rounded-xl px-4 py-2 text-sm font-semibold flex items-center whitespace-nowrap',
                            selectedCategoryId === category.id ? 'bg-white text-black font-bold' : 'bg-transparent border border-white text-white']">
                        <div class="flex items-center">
                            <Icon :icon="category.icon" height="20" />
                            <span class="ml-2">
                                {{ category.name }}
                            </span>
                        </div>
                    </button>


                </div>
                <!-- Floating Button positioned to the right -->
                <Icon icon="fe:arrow-right" width="50" height="50" @click="scrollToRight"
                    class="cursor-pointer pb-2 hidden xl:block" />

            </div>
            <div @click="showCategories = !showCategories"
                class="absolute left-1/2 bottom-[-20px] w-16 h-16 bg-surface-800 rounded-full z-[-1] transform -translate-x-1/2 shadow-lg flex flex-col justify-end items-center">
                <div class="flex items-center justify-center">
                    <Icon :icon="showCategories ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" height="30" />
                </div>
            </div>
        </div>
        <div class="col-span-12 flex gap-3 mb-3">

        </div>

        <div class="col-span-12" v-for="item in filteredMenuItems" :key="item.id">
            <div class="relative flex gap-2 font-bold justify-between card p-2 m-0 w-full border-[0px] " :class="{
                'rounded-bl-none rounded-br-none border-[0px] border-b-[0px] scale-x-105 text-xl': selectedItemId === item.id
            }" @click="toggleItem(item.id)">
                <!-- Circle in the top-right corner -->
                <div :class="{
                    'hidden': selectedItemId === item.id
                }" v-if="isItemAdded(item.id)"
                    class="absolute top-1 border-[0px] left-1 h-5 w-5 text-black bg-emerald-500 border-yellow-500 flex items-center justify-center rounded-full text-sm">
                    {{ getItemQuantity(item.id) }}
                </div>
                <div
                    class="absolute top-1  right-1  text-green-500  border-yellow-500 flex items-center justify-center rounded-full text-sm">
                    <Icon icon="ri:heart-line" height="15" />
                </div>

                <div class="flex gap-3 justify-start ">
                    <!-- Image with Overlay -->
                    <div class="w-16 h-16">
                        <img :src="item.imageUrl" alt="Menu Item" class="w-full h-full object-cover rounded"
                            v-if="item.imageUrl && !failedImages[item.id]" @error="() => handleImageError(item.id)" />
                        <img v-else src="@/assets/pics/fallback.jpg" alt="Default Menu Item"
                            class="w-full h-full object-cover rounded" />

                        <!-- Full Image Overlay -->
                        <!-- <div class="absolute inset-0 bg-black opacity-20 rounded" :class="{
                            'hidden': selectedItemId === item.id
                        }"></div>

                        <div class="absolute inset-0 flex items-center justify-center" :class="{
                            'hidden': selectedItemId === item.id
                        }">
                            <div
                                class="text-white text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center text-yellow-500">
                                2
                            </div>
                        </div> -->
                    </div>


                    <!-- Item Name -->
                    <span class="self-center">{{ item.name }}</span>

                </div>
                <span class="self-center">P{{ item.price }}</span>
            </div>

            <div v-if="selectedItemId === item.id"
                class="flex flex-col bg-surface-700 pb-2 rounded-bl-lg rounded-br-lg border-[0px] border-t-[0px] px-2 py-1 scale-x-105 border-yellow-500">
                <div class="flex gap-1 mt-1 justify-center">
                    <button
                        class="rounded-lg px-2 py-1 min-w-[50%] text-white border-[1px] border-white h-[2.5rem] self-center"
                        @click="showDetails(item)">
                        Details
                    </button>

                    <div class="rounded-lg bg-emerald-500 px-2 py-1 w-full h-[2.5rem] self-center"
                        v-if="isItemAdded(item.id)">
                        <div class="flex justify-between h-full">
                            <div class="self-center rounded-lg bg-white h-6 w-6 items-center justify-center flex"
                                @click="decrementQuantity(item.id)">
                                <Icon :icon="getItemQuantity(item.id) == 1 ? 'fluent:delete-28-filled' : 'typcn:minus'"
                                    class="text-emerald-500" />
                            </div>
                            <div class="self-center font-bold">
                                {{ getItemQuantity(item.id) }}
                            </div>
                            <div class="self-center rounded-lg bg-white h-6 w-6 items-center justify-center flex"
                                @click="incrementQuantity(item.id)">
                                <Icon icon="typcn:plus" class="text-emerald-500" />
                            </div>
                        </div>
                    </div>



                    <button v-else @click="addToOrder(item)" :disabled="loading" class="rounded-lg px-2 py-1 min-w-[50%] text-white border-[1px] border-emerald-500 font-bold
            bg-emerald-500 h-[2.5rem] self-center">
                        <div v-if="loading" class="self-center flex justify-center">
                            <Icon icon="svg-spinners:3-dots-bounce" />
                        </div>
                        <div v-else class="self-center">Add to Order</div>
                    </button>
                </div>
            </div>
        </div>



    </div>



    <Dialog v-model:visible="customerVisible" modal header="Customer Tag"
        :style="{ width: '90vw', minHeight: '50%', padding: '0px' }" position="center">

        <div class="flex flex-wrap gap-2 mt-1">
            <div v-for="(customer, index) in customerList" :key="index" :class="[
                'rounded-full border-[1px] text-lg font-bold h-[3rem] w-[3rem] flex justify-center items-center',
                selectedCustomer === customer ? 'bg-white text-surface-900' : ''
            ]" @click="selectCustomer(customer)">
                {{ customer }}
            </div>
        </div>
    </Dialog>

    <div class="fixed inset-x-0 bottom-2 w-full bg-[#203444] text-black text-center mb-[3.3rem] shadow-lg p-5"
        v-if="orderItemCount > 0">
        <button @click="orderVisible = true"
            class="rounded-lg p-2 w-full h-[3.4rem] p-0 bg-cyan-500 text-black flex justify-between items-center">
            <div class="flex gap-2 items-center">
                <div>
                    <Icon icon="dashicons:food" width="20" height="20" />
                </div>
                <div class="font-bold">
                    {{ totalUniqueItems }}
                </div>
            </div>
            <div class="flex flex-1 justify-center flex-col">
                <div class="font-bold text-black">Order # <span class="font-bold">{{ orderId }}</span></div>
                <div class="text-sm italic">View Order</div>

            </div>
            <div class="font-bold ml-1">
                P {{ totalOrderAmount }}
            </div>
        </button>
    </div>



    <Drawer v-model:visible="orderVisible" :header="'Order # ' + orderId" position="bottom" class="opacity-90"
        :style="{ width: '100%', height: '95vh' }">


        <div class="flex flex-col">
            <div class="flex ">
                <div class="flex gap-2  flex-1 justify-start">
                    <button @click="selectService('Dine in')"
                        :class="selectedService === 'Dine in' ? 'bg-white text-black' : 'bg-transparent text-white'"
                        class="border-[1px] border-white w-auto p-2 px-4 rounded-lg">
                        Dine in
                    </button>
                    <button @click="selectService('Take out')"
                        :class="selectedService === 'Take out' ? 'bg-white text-black' : 'bg-transparent text-white'"
                        class="border-[1px] border-white w-auto p-2 px-4 rounded-lg">
                        Take out
                    </button>
                </div>
                <div class="flex flex-1 justify-end">
                    <div v-if="!selectedCustomer" @click="customerVisible = true"
                        class="rounded-full text-lgs font-bold h-[2rem] w-[33%] self-center flex justify-center items-center flex-col bg-whste text-white-500 border-white-500">
                        <Icon icon="mdi:user-add" height="25" />
                    </div>
                    <div v-else
                        class="rounded-xl border-[1px] text-lg font-bold h-[2.5rem] w-[33%] self-center flex justify-center items-center text-black font-bold bg-white border-whites"
                        @click="customerVisible = true">
                        {{ selectedCustomer }}
                    </div>
                    <!-- <div class="ml-2 font-bold self-center text-xl">
                        Order #{{ orderId }}
                    </div> -->
                </div>


            </div>
            <div class=" h-[56vh] mt-5 w-full overflow-auto mb-4">
                <div v-for="(detail, index) in orderDetails" :key="detail.id">
                    <div :class="[' py-3 px-1', index % 2 === 0 ? 'bg-surface-800' : '']">
                        <div class="flex">
                            <div class="self-center">
                                <img :src="detail.imageUrl" alt="Menu Item"
                                    class="self-center w-[4rem] h-[4rem] rounded-lg border-[1px] border-yellow-500 p-[1px] object-cover"
                                    v-if="detail.imageUrl && !failedImages[detail.id]"
                                    @error="() => handleImageError(detail.id)" />
                                <img v-else src="@/assets/pics/fallback.jpg" alt="Default Menu Item"
                                    class="self-center w-[4rem] h-[4rem] rounded-lg border-[1px] border-yellow-500 p-[1px] object-cover" />
                            </div>
                            <div class="flex flex-col w-full">
                                <div class="">
                                    <div class="flex justify-between px-2">
                                        <div class="flex text-xl font-bold self-center gap-1">
                                            <div>{{ detail.name }}</div>

                                        </div>
                                        <div class="flex flex-col items-end">
                                            <!-- <div class="text-sm italic">Subtotal</div> -->
                                            <div class="text-lg">P{{ detail.subtotal }}</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-between h-full">
                                        <div class="flex flex-col">
                                            <div class="flex px-2 w-1/2 gap-1  opacity-60 self-start">
                                                <div class="text ">Price:</div>
                                                <div class="">P{{ detail.price }}</div>
                                            </div>
                                            <div class="px-2">
                                                <div v-if="detail.note" @click="toggleNoteVisibility(detail.id)"
                                                    class=" rounded-full  flex px-2 opacity-80 text-sm justify-center"
                                                    :class="isNoteVisible(detail.id) ? 'text-surface-900 bg-cyan-400 ' : 'text-cyan-400 border-cyan-400 border-[1px]'">
                                                    <Icon icon='fluent:note-48-filled' height="16" />
                                                    {{ isNoteVisible(detail.id) ? 'Hide Note' : 'View Note' }}
                                                </div>


                                                <div v-else @click="toggleAddNoteVisibility(detail.id)"
                                                    class=" rounded-full flex px-2 opacity-80 text-sm justify-center"
                                                    :class="isAddNoteVisible(detail.id) ? 'text-surface-900 bg-emerald-400 ' : 'text-emerald-400 border-emerald-400 border-[1px]'">
                                                    <Icon icon="material-symbols-light:note-stack-add-sharp"
                                                        height="16" />
                                                    Add Note
                                                </div>
                                            </div>

                                        </div>
                                        <div class="flex px-2 w-1/2 self-start">
                                            <button class="w-full">
                                                <div
                                                    class="rounded-full bg-transparent border-[1px] border-white px-2 py-1 w-full h-[2rem] self-center">
                                                    <div class="flex justify-between h-full">
                                                        <div class="self-center rounded-lg  h-6 w-6 items-center justify-center flex"
                                                            @click="decrementQuantity(detail.menu_item_id)">
                                                            <Icon
                                                                :icon="getItemQuantity(detail.menu_item_id) == 1 ? 'fluent:delete-28-filled' : 'typcn:minus'"
                                                                class="" />
                                                        </div>
                                                        <div class="self-center font-bold">
                                                            {{ detail.quantity }}
                                                        </div>
                                                        <div class="self-center rounded-full h-6 w-6 items-center justify-center flex"
                                                            @click="incrementQuantity(detail.menu_item_id)">
                                                            <Icon icon="typcn:plus" class="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div v-if="isNoteVisible(detail.id)" class="opacity-80 italic px-3 flex gap-2">
                            <div class="w-full p-2" v-if="!isEditingNote(detail.id)">
                                {{ detail.note }}
                            </div>

                            <div v-else class="w-full p-2">
                                <input v-model="editNote[detail.id]" type="text" :placeholder="detail.note"
                                    class="w-full p-2 rounded-lg bg-transparent text-white placeholder-gray-400 border-transparent focus:outline-none focus:border-transparent" />
                            </div>

                            <!-- Button to edit or save the note -->
                            <button @click="deleteNote(detail.menu_item_id)"
                                class="mt-2 tep-1 opacity-100 text-red-500">
                                <Icon icon='mdi:note-remove' height="20" />
                            </button>

                            <button
                                @click="isEditingNote(detail.id) ? saveNote(detail.menu_item_id, editNote[detail.id]) : editNoteField(detail.id)"
                                class="mt-2 tep-1 opacity-100"
                                :class="isEditingNote(detail.id) ? 'text-emerald-400' : 'text-cyan-400'">
                                <Icon :icon="isEditingNote(detail.id) ? 'mdi:note-check' : 'mdi:note-edit'"
                                    height="20" />
                            </button>


                        </div>


                        <div v-if="isAddNoteVisible(detail.id)" class="opacity-80 italic px-3 flex gap-2">
                            <input v-if="isAddNoteVisible(detail.id)" v-model="newNoteText" type="text"
                                placeholder="Type your note here..." ref="noteInput"
                                class="w-full p-2 rounded-lg bg-transparent text-white placeholder-gray-400 border-transparent focus:outline-none focus:border-transparent" />


                            <!-- Button to save the note -->
                            <button @click="saveNote(detail.menu_item_id, newNoteText)"
                                class="mt-2 text-emerald-400 p-1 opacity-100">
                                <Icon icon="mdi:note-check" height="20" />
                            </button>

                        </div>

                    </div>
                </div>

            </div>

            <div class="flex gap-2 flex-col ">
                <div class="flex justify-between px-4">
                    <div class="font-bold text-xl">
                        Total:
                    </div>
                    <div class="font-bold text-2xl">
                        P {{ totalOrderAmount }}
                    </div>

                </div>
                <div class="flex gap-2">
                    <button
                        class="text-emerald-500 w-full h-[3rem] rounded-xl font-bold flex justify-center border-[1px] border-emerald-500 w-1/2"
                        @click="confirmOrder">
                        <div class="flex self-center gap-2">
                            <div>Confirm Order</div>
                        </div>
                    </button>
                    <button @click="paymentVisible = true"
                        class="bg-emerald-500 w-full h-[3rem] rounded-xl font-bold flex justify-center border-[1px] border-emerald-500 w-1/2">
                        <div class="flex self-center gap-2">
                            <div>Proceed to Payment</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </Drawer>

    <Drawer v-model:visible="detailsVisible" header="Item Details" position="bottom" class="opacity-80"
        :style="{ width: '100%', minHeight: '65vh', height: 'auto' }">
        <div v-if="selectedItem">
            <div>
                <div class="w-full bg-white justify-center flex rounded-lg py-3 mb-2">
                    <img :src="selectedItem.imageUrl" alt="Menu Item" class="h-[20vh] w-auto"
                        v-if="selectedItem.imageUrl && !failedImages[selectedItem.id]"
                        @error="() => handleImageError(selectedItem.id)" />
                    <img v-else src="@/assets/pics/fallback.jpg" alt="Default Menu Item" class="h-[20vh] w-auto" />
                </div>
                <div class="text-2xl font-bold">{{ selectedItem.name }}</div>
                <!-- <div class="text-yellow-500 flex gap-1">
                            <Icon v-for="index in starsDisplay.fullStars" :key="'full-' + index" icon="ic:round-star"
                                height="20" />
                            <Icon v-if="starsDisplay.halfStar" icon="ic:round-star-half" height="20" />
                            <Icon v-for="index in starsDisplay.emptyStars" :key="'empty-' + index"
                                icon="ic:round-star-outline" height="20" />
                        </div> -->
                <p v-html="selectedItem.description"></p>

                <div>
                    Price: ₱{{ selectedItem.price }}
                </div>
            </div>
            <!-- Conditionally render buttons based on if item is added to order -->
            <div class="flex justify-center mt-4 mb-4">
                <div v-if="!isItemAdded(selectedItem.id)" @click="addToOrder(selectedItem)"
                    class="bg-emerald-500 justify-center p-3 rounded-lg flex w-full text-white" severity="success">
                    <Icon icon="ic:baseline-add-shopping-cart" height="20" />
                    <b>Add to Order</b>
                </div>
                <div v-else class="w-full">
                    <div class="flex justify-between gap-2 " severity="info">
                        <div class="flex-1 rounded-lg border-[1px] px-2">
                            <div class="flex justify-between h-full">
                                <div class="self-center rounded-lg bg-white h-6 w-6 items-center justify-center flex"
                                    @click="decrementQuantity(selectedItem.id)">
                                    <Icon
                                        :icon="getItemQuantity(selectedItem.id) == 1 ? 'fluent:delete-28-filled' : 'typcn:minus'"
                                        class="text-black" />
                                </div>
                                <div class="self-center font-bold">
                                    {{ getItemQuantity(selectedItem.id) }}
                                </div>
                                <div class="self-center rounded-lg bg-white h-6 w-6 items-center justify-center flex"
                                    @click="incrementQuantity(selectedItem.id)">
                                    <Icon icon="typcn:plus" class="text-black" />
                                </div>
                            </div>
                        </div>
                        <div class="bg-cyan-500 justify-center p-3 rounded-lg flex w-full text-black flex-1"
                            @click="showOrderDetails">
                            <Icon icon="ic:outline-shopping-cart" height="20" />
                            <b>My Orders</b>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </Drawer>

    <Dialog v-model:visible="allOrdersVisible" modal :style="{ width: '95vw', minHeight: '95%', margin: '0px' }"
        position="center" header="All Orders">
        <div class="p-3">
            <div v-for="(customerOrders, index) in ordersTodayGroupedByCustomer" :key="index">
                <!-- Display each customer -->
                <div class="font-bold py-2 flex" @click="toggleCustomerOrders(customerOrders.customerTag)">
                    <div class="flex-1 text-xl">
                        Customer {{ customerOrders.customerTag }}
                    </div>
                    <div class="flex-1 text-center self-center">
                        Total Due: P{{ customerOrders.totalAmount }}
                    </div>
                    <div class="self-center w-[10%] flex justify-end">
                        <Icon
                            :icon="isCustomerOrdersVisible(customerOrders.customerTag) ? 'iconamoon:arrow-down-2-bold' : 'iconamoon:arrow-up-2-bold'"
                            height="20" />
                    </div>
                </div>

                <!-- Orders list per customer -->
                <div :class="isCustomerOrdersVisible(customerOrders.customerTag) ? '' : 'hidden'">
                    <div v-for="order in customerOrders.orders" :key="order.id">
                        <div @click="viewOrderDetails(order.id)" class="flex gap-1">
                            <div class="flex-1 flex">
                                <div>
                                    <Icon icon="si:down-right-duotone" />
                                </div>
                                <div class="underline">
                                    #{{ order.id }}
                                </div>
                            </div>
                            <div class="flex-1 text-center">
                                {{ order.service }}
                            </div>
                            <div class="flex-1 text-center">
                                {{ order.total_price }}
                            </div>
                            <div class="flex-1 text-end" :class="getStatusColor(order.status)">
                                {{ order.status }}
                            </div>
                        </div>
                    </div>
                    <!-- Actions for each customer -->
                    <div class="flex justify-end mt-2 gap-2">
                        <button class="w-1/3 rounded-xl border-red-500 border-[1px] text-red-500 p-1"
                            @click="closeCustomer(customerOrders.customerTag)">
                            Close
                        </button>
                        <button class="w-1/3 rounded-xl border-emerald-500 border-[1px] text-emerald-500 p-1"
                            @click="addOrderForCustomer(customerOrders.customerTag)">
                            Add Order
                        </button>
                        <button class="w-1/3 rounded-xl bg-emerald-500 p-1"
                            @click="toggleBatchPayment(customerOrders.customerTag)">
                            Payment
                        </button>
                    </div>
                </div>
                <div class="border-t my-2"></div> <!-- Line separator -->
            </div>
        </div>
    </Dialog>


    <Drawer v-model:visible="orderDetailsPerCustomer" position="bottom" class="opacity-90"
        :header="'Order #' + (selectedOrder?.id || '')" :style="{ width: '100%', minHeight: '55vh', height: 'auto' }">
        <div v-if="selectedOrder" class="flex p-3">
            <div class="text-lg font-bold w-1/3">
                P{{ selectedOrder.total_price }}
            </div>
            <div class="flex gap-2 w-2/3 justify-end">
                <button class="rounded-xl bg-emerald-500 p-1 w-1/2"
                    @click=goToPayment(selectedOrder.id)>Payment</button>
                <button class="rounded-xl bg-cyan-500 p-1 w-1/2" @click="goToOrder(selectedOrder.id)">Go to
                    Order</button>
            </div>
        </div>
        <ul class="overflow-auto mb-4 max-h-[50vh]">
            <li v-for="item in selectedOrder.details" :key="item.id" class="p-2">
                <div class="flex gap-2 overflow-auto">
                    <div class="w-[20%]">
                        <img src="@/assets/pics/fallback.jpg" alt="Menu Item"
                            class="w-full h-full object-cover rounded" />
                    </div>
                    <div class="self-center flex-1 flex flex-col">
                        <div>{{ item.menu_name }}</div>
                        <div>{{ item.quantity }} x P{{ item.menu_price }}</div>
                    </div>
                    <div class="w-[20%] text-xl font-bold flex justify-end">P{{ item.subtotal }}</div>
                </div>
            </li>
        </ul>
    </Drawer>
    <Drawer v-model:visible="paymentVisible" position="bottom" class="opacity-100"
        :style="{ width: '100%', minHeight: '95vh', height: 'auto' }">
        <div class="flex flex-col justify-between h-[82vh]">
            <div>
                <div class="flex text-xl font-bold mb-2">
                    Payment Method
                </div>
                <div class="flex gap-2 mb-3">
                    <button @click="selectPaymentMethod('Cash')" :class="{
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col bg-white text-surface-900': selectedPaymentMethod === 'Cash',
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col': selectedPaymentMethod !== 'Cash'
                    }">
                        <Icon icon="vaadin:cash" height="20" />
                        Cash
                    </button>
                    <button @click="selectPaymentMethod('Gcash')" :class="{
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col bg-white text-surface-900': selectedPaymentMethod === 'Gcash',
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col': selectedPaymentMethod !== 'Gcash'
                    }">
                        <Icon icon="mynaui:letter-g-hexagon" height="20" />
                        Gcash
                    </button>
                    <button @click="selectPaymentMethod('Paypal')" :class="{
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col bg-white text-surface-900': selectedPaymentMethod === 'Paypal',
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col': selectedPaymentMethod !== 'Paypal'
                    }">
                        <Icon icon="ic:sharp-paypal" height="20" />
                        Paypal
                    </button>
                    <button @click="selectPaymentMethod('Bank')" :class="{
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col bg-white text-surface-900': selectedPaymentMethod === 'Bank',
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col': selectedPaymentMethod !== 'Bank'
                    }">
                        <Icon icon="mdi-light:bank" height="20" />
                        Bank
                    </button>
                </div>
                <div class="justify-between flex mb-2 text-xl font-bold">
                    <div>
                        {{ paymentStatus === 'change' ? 'Change' : 'Due' }}:
                    </div>
                    <div>
                        P{{ changeDue }}
                    </div>
                </div>
                <div class="flex mb-2 gap-2">
                    <InputNumber v-model="amountTendered" placeholder="Amount Tendered" class="w-full h-[2.5rem]" />
                    <button @click="clearAmount"
                        class="border-[1px] border-red-500 text-red-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem] px-2 w-[30%]">
                        Clear
                    </button>
                    <button @click="setExactAmount"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem] px-2 w-[30%]">
                        Exact
                    </button>
                </div>

                <div class="flex gap-2 flex-wrap w-full mb-2">
                    <button @click="addAmount(1)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P1
                    </button>
                    <button @click="addAmount(5)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P5
                    </button>
                    <button @click="addAmount(10)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P10
                    </button>
                    <button @click="addAmount(20)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P20
                    </button>
                </div>
                <div class="flex gap-2 flex-wrap w-full mb-2">
                    <button @click="addAmount(50)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P50
                    </button>
                    <button @click="addAmount(100)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P100
                    </button>
                    <button @click="addAmount(500)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P500
                    </button>
                    <button @click="addAmount(1000)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P1000
                    </button>
                </div>
            </div>
            <div class="flex w-full">
                <button @click="confirmPayment" :disabled="paymentStatus === 'due'" :class="{
                    'bg-emerald-500': paymentStatus !== 'due',
                    'bg-gray-400 cursor-not-allowed': paymentStatus === 'due',
                    'text-white': paymentStatus !== 'due',
                    'text-gray-300': paymentStatus === 'due'
                }" class="rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem] flex-1">
                    Confirm Payment
                </button>
            </div>


        </div>
    </Drawer>
    <Drawer v-model:visible="batchPaymentVisible" position="bottom" class="opacity-100"
        :style="{ width: '100%', minHeight: '95vh', height: 'auto' }">
        <div class="flex flex-col justify-between h-[82vh]">
            <div class="flex flex-col gap-2">
                <div class="text-xl font-bold mb-4">Customer {{ customerTagForBatchPayment }}
                </div>
                <div class="flex text-xl font-bold mb-2">
                    Payment Method
                </div>
                <div class="flex gap-2 mb-3">
                    <button @click="selectPaymentMethod('Cash')" :class="{
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col bg-white text-surface-900': selectedPaymentMethod === 'Cash',
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col': selectedPaymentMethod !== 'Cash'
                    }">
                        <Icon icon="vaadin:cash" height="20" />
                        Cash
                    </button>
                    <button @click="selectPaymentMethod('Gcash')" :class="{
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col bg-white text-surface-900': selectedPaymentMethod === 'Gcash',
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col': selectedPaymentMethod !== 'Gcash'
                    }">
                        <Icon icon="mynaui:letter-g-hexagon" height="20" />
                        Gcash
                    </button>
                    <button @click="selectPaymentMethod('Paypal')" :class="{
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col bg-white text-surface-900': selectedPaymentMethod === 'Paypal',
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col': selectedPaymentMethod !== 'Paypal'
                    }">
                        <Icon icon="ic:sharp-paypal" height="20" />
                        Paypal
                    </button>
                    <button @click="selectPaymentMethod('Bank')" :class="{
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col bg-white text-surface-900': selectedPaymentMethod === 'Bank',
                        'border-[1px] border-white p-2 rounded-lg h-16 w-20 items-center font-bold flex flex-col': selectedPaymentMethod !== 'Bank'
                    }">
                        <Icon icon="mdi-light:bank" height="20" />
                        Bank
                    </button>
                </div>
                <!-- Check if batchPaymentVisible is true and display the customer's payment info -->
                <div class="justify-between flex mb-2 text-xl font-bold">
                    <div>
                        {{ paymentStatus === 'change' ? 'Change' : 'Due' }}:
                    </div>
                    <div>
                        P{{ batchChangeDue }}
                    </div>
                </div>
                <div class="flex mb-2 gap-2">
                    <InputNumber v-model="amountTendered" placeholder="Amount Tendered" class="w-full h-[2.5rem]" />
                    <button @click="batchClearAmount"
                        class="border-[1px] border-red-500 text-red-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem] px-2 w-[30%]">
                        Clear
                    </button>
                    <button @click="batchSetExactAmount"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem] px-2 w-[30%]">
                        Exact
                    </button>
                </div>

                <div class="flex gap-2 flex-wrap w-full mb-2">
                    <button @click="batchAddAmount(1)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P1
                    </button>
                    <button @click="batchAddAmount(5)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P5
                    </button>
                    <button @click="batchAddAmount(10)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P10
                    </button>
                    <button @click="batchAddAmount(20)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P20
                    </button>
                </div>
                <div class="flex gap-2 flex-wrap w-full mb-2">
                    <button @click="batchAddAmount(50)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P50
                    </button>
                    <button @click="batchAddAmount(100)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P100
                    </button>
                    <button @click="batchAddAmount(500)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P500
                    </button>
                    <button @click="batchAddAmount(1000)"
                        class="border-[1px] border-cyan-500 text-cyan-500 rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem]  flex-1">
                        P1000
                    </button>
                </div>
            </div>
            <div v-for="order in selectedCustomerOrders" :key="order.id" class="flex justify-between border-b p-2">
                <div>
                    <div class="font-bold">Order #{{ order.id }}</div>
                    <div>{{ order.service }}</div>
                </div>
                <div class="flex items-center">
                    <div class="mr-2">P{{ order.total_price }}</div>
                    <div class="text-sm text-gray-500">{{ order.status }}</div>
                </div>
            </div>
            <div class="flex w-full">
                <button @click="confirmPaymentForCustomer" :disabled="paymentStatus === 'due'" :class="{
                    'bg-emerald-500': paymentStatus !== 'due',
                    'bg-gray-400 cursor-not-allowed': paymentStatus === 'due',
                    'text-white': paymentStatus !== 'due',
                    'text-gray-300': paymentStatus === 'due'
                }" class="rounded-lg self-center flex justify-center items-center font-bold flex h-[2.5rem] flex-1">
                    Confirm Payment
                </button>
            </div>
        </div>

    </Drawer>

</template>

<style scoped>
.custom-avatar-border {
    border: 2px solid #4caf50;
    padding: 2px;
}

.deep .button-class {
    background-color: white !important;
    /* Use important only as a last resort */
}
</style>
