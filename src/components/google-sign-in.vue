<template>
    <div>
        <q-avatar :size="'120px'" :color="'primary'" v-bind:class="{ blur: isLoading }">
            <q-icon class="icon--size" v-bind:name="user.image" />
            <!-- <img src="https://cdn.quasar.dev/img/avatar.png" /> -->
        </q-avatar>
        <span v-bind:class="{ blur: isLoading }">{{ user.name }}</span>

        <button v-if="!isSignedIn" v-on:click="signIn" v-bind:disabled="isLoading">Sign In</button>
        <button v-if="isSignedIn" v-on:click="logOff" v-bind:disabled="isLoading">Log Off</button>
    </div>
</template>

<script>
import { SIGN_IN, LOG_OFF } from '../store/mutation-types';

export default {
    data: function() {
        return {
            isLoading: false,
            isSignedIn: false,
        };
    },
    mounted() {
        this.$store.subscribe(({ type }) => {
            if (type === SIGN_IN) {
                this.isSignedIn = true;
            } else if (type === LOG_OFF) {
                this.isSignedIn = false;
            }
            this.isLoading = false;
        });
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    methods: {
        signIn: function() {
            this.isLoading = true;
            this.$store.dispatch(SIGN_IN);
        },
        logOff: function() {
            this.isLoading = true;
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
.blur {
    filter: blur(4px);
}
</style>
