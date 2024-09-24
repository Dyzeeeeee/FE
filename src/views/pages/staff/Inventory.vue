<template>
    <div class="qr-reader">
      <qrcode-stream
        v-if="cameraActive"
        :formats="['qr_code']"
        @detect="onDetect"
        @camera-on="onCameraOn"
        @error="onError"
      >
        <template #default>
          <div class="overlay">Scanning for QR Codes...</div>
        </template>
      </qrcode-stream>
      <button @click="toggleCamera">
        {{ cameraActive ? 'Turn Camera Off' : 'Turn Camera On' }}
      </button>
      <div v-if="scannedContent" class="scanned-content">
        <h3>Scanned QR Code Content:</h3>
        <p>{{ scannedContent }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { QrcodeStream } from 'vue-qrcode-reader';
  
  const cameraActive = ref(false);
  const scannedContent = ref('');
  
  const onDetect = (detectedCodes) => {
    console.log('Detected QR Codes:', detectedCodes);
    scannedContent.value = detectedCodes.map(code => code.rawValue).join(', ');
  };
  
  const onCameraOn = (capabilities) => {
    console.log('Camera is on, capabilities:', capabilities);
  };
  
  const onError = (error) => {
    console.error('Error with QR Code Stream:', error);
    scannedContent.value = ''; // Clear previous content on error
  };
  
  const toggleCamera = () => {
    cameraActive.value = !cameraActive.value;
    if (!cameraActive.value) {
      scannedContent.value = ''; // Optionally clear the scanned content when camera is turned off
    }
  };
  </script>
  
  <style scoped>
  .qr-reader {
    position: relative;
    width: 100%;
    height: 400px;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 20px;
  }
  
  .scanned-content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: white;
    color: black;
    text-align: center;
    padding: 10px;
  }
  
  button {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 10px 20px;
    cursor: pointer;
  }
  </style>
  