import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import '/node_modules/primeflex/primeflex.css'

import 'primevue/resources/themes/lara-light-green/theme.css'
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css'

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { FaFlag, RiZhihuFill, IoMagnet} from "oh-vue-icons/icons";


addIcons(FaFlag, RiZhihuFill, IoMagnet);



const app = createApp(App);

app.use(PrimeVue, { ripple: true });
app.component("v-icon", OhVueIcon);
// app.component('Accordion', Accordion);
// app.component('Button', Button);
// app.component('Card', Card)
// app.component('AccordionTab', AccordionTab)
app.mount('#app')

