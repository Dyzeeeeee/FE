<template>
  <div>
    <button @click="printDiv">Print Content</button>
    <div ref="printableArea" class="print-area">
      <h1>Printable Content</h1>
      <p>This is some dummy text to demonstrate printing functionality in Vue.js.</p>
      <ul>
        <li>List Item 1</li>
        <li>List Item 2</li>
        <li>List Item 3</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const printableArea = ref(null);

const printDiv = () => {
  const printContent = printableArea.value.innerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContents;
};
</script>

<style scoped>
.print-area {
  border: 1px solid #000;
  padding: 20px;
  margin-top: 20px;
}

button {
  margin-bottom: 20px;
}
</style>
