import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import router from './router'
import DamUI from './DamUI.vue';

import 'element-plus/dist/index.css'
// import App from './App.vue';


const app = createApp(DamUI);
// createApp(App).mount('#app');

app.use(router)
app.use(ElementPlus)
app.mount('#app');
