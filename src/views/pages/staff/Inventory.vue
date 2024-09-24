<template>
    <div class="qr-reader">
        <qrcode-stream :formats="['qr_code']" @detect="onDetect" @camera-on="onCameraOn" @error="onError">
            <template #default>
                <div class="overlay">Scanning for QR Codes...</div>
            </template>
        </qrcode-stream>
    </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader';

export default {
    components: {
        QrcodeStream
    },
    methods: {
        onDetect(detectedCodes) {
            console.log('Detected QR Codes:', detectedCodes);
            // Handle detected QR codes here (e.g., navigate to a URL or display data)
        },
        onCameraOn(capabilities) {
            console.log('Camera is on, capabilities:', capabilities);
            // This is where you can check if the torch is supported and possibly enable it
        },
        onError(error) {
            console.error('Error with QR Code Stream:', error);
            // Handle errors appropriately (e.g., display a user-friendly message)
        }
    }
}
</script>

<style scoped>
.qr-reader {
    position: relative;
    width: 100%;
    /* Adjust size as needed */
    height: 400px;
    /* Adjust size as needed */
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
</style>