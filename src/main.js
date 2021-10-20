import { createApp, h } from 'vue'
import ElementPlus from 'element-plus'
import router from './router'
import DamUI from './DamUI.vue';
import { plugin } from 'echarts-for-vue';
import VueCesium from 'vue-cesium'
import zhHans from 'vue-cesium/lib/locale/lang/zh-hans'
import * as echarts from 'echarts';

import 'element-plus/dist/index.css'
// import 'vue-cesium/dist/index.css'


const app = createApp(DamUI);

app.use(plugin, { echarts, h }); 
app.use(router);
app.use(VueCesium, {
    locale: zhHans
});
app.use(ElementPlus);
app.mount('#app');
