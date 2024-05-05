import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createAuth0 } from '@auth0/auth0-vue';

import router from './router';

import PrimeVue from 'primevue/config';
import '/node_modules/primeflex/primeflex.css'


import 'primevue/resources/themes/aura-light-blue/theme.css'
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css'

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { FaFlag, RiZhihuFill, IoMagnet} from "oh-vue-icons/icons";


addIcons(FaFlag, RiZhihuFill, IoMagnet);

const auth0 = createAuth0({
    domain: 'dev-qrziy3kg2izg6egj.us.auth0.com',
    clientId: 'QkvKpXKmFZ1EVm6gYlSaV5tGlbZuBJ3b',
    authorizationParams: {
        // @ts-ignore
      redirect_uri: 'http://localhost:5173',
      audience: 'https://www.bethedisclosure.com/api'
    },
    cacheLocation: 'localstorage',
    
  });



const app = createApp(App);

app.use(auth0);
app.use(PrimeVue, { ripple: true });
app.use(router);
app.component("VIcon", OhVueIcon);
// app.component('Accordion', Accordion);
// app.component('Button', Button);
// app.component('Card', Card)
// app.component('AccordionTab', AccordionTab)
app.mount('#app')

