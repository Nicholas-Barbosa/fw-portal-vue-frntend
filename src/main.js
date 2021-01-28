import { createApp } from 'vue'
import { reactive } from 'vue';
import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './router'
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'prismjs/themes/prism-coy.css';
import './assets/layout/layout.scss';
import './assets/layout/flags/flags.css';
import 'prismjs/themes/prism-coy.css';
import '@fullcalendar/core/main.min.css';
import '@fullcalendar/daygrid/main.min.css';
import '@fullcalendar/timegrid/main.min.css';
import './assets/layout/layout.scss';
import './assets/layout/flags/flags.css';

//PrimeVue components

import InputText from 'primevue/inputtext';
import Ripple from 'primevue/ripple';
import InputSwitch from 'primevue/inputswitch';
import RadioButton from 'primevue/radiobutton';

const app = createApp(App);

app.config.globalProperties.$appState = reactive({ inputStyle: 'outlined' });
app.config.globalProperties.$primevue = reactive({ ripple: true });

app.use(PrimeVue);
app.use(router);

app.directive('ripple', Ripple);

//Add PrimeVue components for all application
app.component("InputText",InputText);
app.component('InputSwitch',InputSwitch)
app.component('RadioButton',RadioButton)


app.mount('#app')
