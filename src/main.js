import Vue from 'vue';
import App from './App.vue';
import router from './router';

const SocialSharing = require('vue-social-sharing');

Vue.config.productionTip = false;

Vue.use(SocialSharing);

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
