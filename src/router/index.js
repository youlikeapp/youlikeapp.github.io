import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/Home';
import About from '../components/About';
import Extension from '../components/Extension';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        { path: '/home', name: 'home', component: Home },
        { path: '/about', name: 'about', component: About },
        { path: '/extension', name: 'extension', component: Extension },
        { path: '*', redirect: '/' },
    ],
});
