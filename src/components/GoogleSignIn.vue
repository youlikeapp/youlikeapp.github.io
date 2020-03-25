<template>
    <div>
        <q-card class="my-card" style=" width: 120px">
            <q-avatar :size="'120px'" :color="'primary'" v-bind:class="{ blur: isLoading }">
                <q-icon class="icon--size" v-bind:name="user.image" />
            </q-avatar>
            <div v-bind:class="{ blur: isLoading }">
                <div class="text-subtitle2">{{ user.name }}</div>
            </div>
            <q-card-actions>
                <q-btn
                    flat
                    v-if="!isSignedIn"
                    v-on:click="signIn"
                    v-bind:disabled="isLoading"
                >Sign In</q-btn>
                <q-btn
                    flat
                    v-if="isSignedIn"
                    v-on:click="logOff"
                    v-bind:disabled="isLoading"
                >Log Off</q-btn>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script>
import { SIGN_IN, LOG_OFF } from '../store/mutation-types';

function appendPrefixIfImage(image) {
    return /jpg|jpeg|png&/gi.test(image) ? 'img:' + image : image;
}

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
            const { name, image } = this.$store.state.user;
            const i = appendPrefixIfImage(image);
            return { name, image: i };
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
