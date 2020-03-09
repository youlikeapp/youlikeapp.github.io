<template>
    <div>
        <q-avatar :size="'120px'" :color="'primary'">
            <q-icon class="icon--size" v-bind:name="user.image" />
            <!-- <img src="https://cdn.quasar.dev/img/avatar.png" /> -->
        </q-avatar>

        <span>{{ user.name }}</span>
        <button v-on:click="signIn">Sign In</button>
        <button v-on:click="logOff">Log Off</button>
    </div>
</template>

<script>
import { SIGN_IN, LOG_OFF } from '../store/mutation-types';

export default {
    data: function() {
        return {
            isLoading: false,
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    methods: {
        signIn: function() {
            // this.isLoading = true;
            this.$store.dispatch(SIGN_IN);
        },
        logOff: function() {
            // this.isLoading = true;
            this.$store.dispatch(LOG_OFF);
        },
    },
};
</script>

<style scoped>
.icon--size {
    height: 120px;
    width: 120px;
}
</style>
