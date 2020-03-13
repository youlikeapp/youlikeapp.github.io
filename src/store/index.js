import Vue from 'vue';
import Vuex from 'vuex';

import * as type from './mutation-types';

import googleApiService from '../services/google-api.service';

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
                googleApiService.signIn().then(
                    ({ name, image }) => {
                        commit(type.SIGN_IN, {
                            name,
                            image: image,
                            isSignedIn: true,
                        });
                    },
                    () => {
                        commit(type.LOG_OFF, { ...initialState.user });
                    }
                );
            },
            [type.LOG_OFF]() {
                googleApiService.logOff();
            },
            [type.SET_UP_GOOGLE_AUTHENTICATION_API]({ commit }) {
                googleApiService.setUpAuthInstance().then(() => {
                    googleApiService.listenToSignedInChanges(
                        ({ isSignedIn, user }) => {
                            if (isSignedIn) {
                                commit(type.SIGN_IN, {
                                    name: user.name,
                                    image: user.image,
                                    isSignedIn,
                                });
                            } else {
                                commit(type.LOG_OFF, { ...initialState.user });
                            }
                        }
                    );
                });
            },
        },
        strict: process.env.DEV,
    });

    return Store;
}
