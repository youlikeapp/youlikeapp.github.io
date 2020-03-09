import Vue from 'vue';
import Vuex from 'vuex';

import * as type from './mutation-types';

Vue.use(Vuex);

const initialState = {
    user: {
        name: 'Anonymous User',
        image: 'far fa-user',
        isSignedIn: false,
    },
};

export default function(/* { ssrContext } */) {
    const Store = new Vuex.Store({
        state: { ...initialState },
        mutations: {
            [type.SIGN_IN](state, user) {
                state.user = { ...user };
            },
            [type.LOG_OFF](state, user) {
                state.user = { ...user };
            },
        },
        actions: {
            [type.SIGN_IN]({ commit }) {
                setTimeout(() => {
                    commit(type.SIGN_IN, {
                        name: 'Mateusz Garbaciak',
                        image: 'img:statics/photo.png',
                    });
                }, 500);
            },
            [type.LOG_OFF]() {
                setTimeout(() => {
                    this.commit(type.LOG_OFF, initialState.user);
                }, 500);
            },
        },
        strict: process.env.DEV,
    });

    return Store;
}
