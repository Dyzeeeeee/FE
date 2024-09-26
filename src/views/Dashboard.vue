<template>
  <div class="receipt-container">
    <div class="receipt" ref="receiptDiv"></div>
    <button @click="shareImage">Share as Image</button>
  </div>
</template>

<script setup>
import html2canvas from 'html2canvas';
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

const shareImage = async () => {
  const canvas = await html2canvas(receiptDiv.value);
  const image = canvas.toDataURL("image/png");
  const blob = await (await fetch(image)).blob();
  if (navigator.share) {
    try {
      await navigator.share({
        files: [new File([blob], "receipt.png", { type: "image/png" })],
        title: "Receipt",
        text: "Here is a snapshot of your receipt.",
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
.receipt-container {
  text-align: center;
}

.receipt {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  margin: 20px auto;
  background-color: #000000;
  font-family: Arial, sans-serif;
}

.receipt-title,
.receipt-date,
.receipt-total {
  color: #333;
}

.receipt-items,
.receipt-item {
  color: #666;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #45a049;
}
</style>
