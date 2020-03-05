import Vue from 'vue';
import App from './App.vue';
import router from './router';
import setUpPlugins from './plugins-config';

setUpPlugins();

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
