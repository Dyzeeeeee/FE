import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { Icon } from '@iconify/vue';
import './registerServiceWorker';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import Lara from '@primevue/themes/lara';
const app = createApp(App);
app.component('Icon', Icon);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Lara,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
        