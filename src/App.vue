<template>
    <div id="q-app">
        <router-view />
    </div>
</template>

<script>
import { SET_UP_GOOGLE_AUTHENTICATION_API } from './store/mutation-types';
import Vue from 'vue';

const googleAuthenticationApi = 'https://apis.google.com/js/platform.js';

export default {
    name: 'App',
    mounted() {
        Vue.loadScript(googleAuthenticationApi).then(() => {
            this.$store.dispatch(SET_UP_GOOGLE_AUTHENTICATION_API);
        });
    },
};
</script>
