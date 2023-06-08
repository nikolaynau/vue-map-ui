import { createApp } from 'vue';
import App from './app.vue';
import router from './router';
import { Icon } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './style.css';

Icon.Default.imagePath = '/';

const app = createApp(App);
app.use(router);
app.mount('#app');
