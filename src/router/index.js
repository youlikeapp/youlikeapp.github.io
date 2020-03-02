import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/Home';
import About from '../components/About';
import HelloWorld from '../components/HelloWorld';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        { path: '/', name: '/', component: HelloWorld },
        { path: '/home', name: 'home', component: Home },
        { path: '/about', name: 'about', component: About },
        { path: '*', redirect: '/' },
    ],
});
