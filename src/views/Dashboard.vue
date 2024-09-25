<template>
  <div>
    <button @click="shareContent">Share</button>
  </div>
</template>

<script setup>
const shareContent = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Check this out!',
        text: 'This is an awesome content to share.',
        url: 'https://yourwebsite.com',
      });
      console.log('Content shared successfully');
    } catch (err) {
      console.error('Error sharing:', err);
    }
  } else {
    console.log('Web Share API not supported in this browser.');
  }
}
</script>


<style>
button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
