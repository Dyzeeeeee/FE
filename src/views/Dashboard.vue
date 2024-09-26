<template>
  <div class="receipt" ref="receiptDiv"></div>
  <button @click="shareContent">Share</button>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const receiptDiv = ref(null);

const items = [
  { id: 1, name: 'Coffee', quantity: 2, price: 3.50 },
  { id: 2, name: 'Bagel', quantity: 1, price: 2.00 },
  { id: 3, name: 'Muffin', quantity: 3, price: 1.50 },
];

const currentDate = new Date().toLocaleDateString();

onMounted(() => {
  generateReceipt();
});

const generateReceipt = () => {
  const receiptHtml = `
    <h2 class="receipt-title">Receipt</h2>
    <p class="receipt-date">${currentDate}</p>
    <div class="receipt-items">
      ${items.map(item => `
        <div class="receipt-item">
          <span class="item-name">${item.name}</span>
          <span class="item-quantity">x${item.quantity}</span>
          <span class="item-price">$${item.price.toFixed(2)}</span>
        </div>`).join('')}
    </div>
    <div class="receipt-total">
      <strong>Total: $${total().toFixed(2)}</strong>
    </div>
  `;

  receiptDiv.value.innerHTML = receiptHtml;
};

const total = () => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

const shareContent = async () => {
  if (navigator.share) {
    try {
      const blob = new Blob([receiptDiv.value.innerHTML], { type: 'text/html' });
      const file = new File([blob], 'receipt.html', { type: 'text/html' });

      await navigator.share({
        title: 'Your Receipt',
        text: 'Here’s your receipt for your recent purchase.',
        files: [file],
      });
      console.log('Receipt shared successfully');
    } catch (err) {
      console.error('Error sharing:', err);
    }
  } else {
    console.log('Web Share API not supported in this browser.');
  }
};
</script>

<style scoped>
.receipt {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  margin: 20px auto;
  background-color: #696969;
  font-family: Arial, sans-serif;
}

.receipt-title {
  text-align: center;
  margin-bottom: 10px;
}

.receipt-date {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.receipt-items {
  margin-bottom: 20px;
}

.receipt-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.item-name {
  flex: 1;
}

.item-quantity {
  margin: 0 10px;
}

.item-price {
  width: 60px;
  text-align: right;
}

.receipt-total {
  text-align: right;
  font-weight: bold;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
