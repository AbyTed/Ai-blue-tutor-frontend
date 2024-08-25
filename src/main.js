import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { FontAwesomeIcon } from './font-awesome'; // Import your Font Awesome setup

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon); // Register Font Awesome component globally
app.use(router);
app.mount('#app');
