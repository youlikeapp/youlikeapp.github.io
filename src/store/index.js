import Vue from 'vue';
import Vuex from 'vuex';

import * as type from './mutation-types';

import googleApiService from '../services/google-api.service';
import youtubeRatingService from '../services/youtube-rating.service';

Vue.use(Vuex);

const initialState = {
    user: {
        name: 'Anonymous User',
        image: 'far fa-user',
        isSignedIn: false,
    },
    checkedVideos: {
        withLikes: [],
        withoutLikes: [],
    },
    savedVideos: [],
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
            [type.CHECK_VIDEOS](state, checkedVideos) {
                state.checkedVideos = { ...checkedVideos };
            },
            [type.GET_SAVED_VIDEOS](state, savedVideos) {
                state.savedVideos = savedVideos;
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
                    googleApiService.listenToSignedInChanges(({ isSignedIn, user }) => {
                        if (isSignedIn) {
                            commit(type.SIGN_IN, {
                                name: user.name,
                                image: user.image,
                                isSignedIn,
                            });
                        } else {
                            commit(type.LOG_OFF, { ...initialState.user });
                        }
                    });
                });
            },
            [type.CHECK_VIDEOS]({ commit }, { videosToCheck }) {
                youtubeRatingService.checkVideos(videosToCheck).then(checkedVideos => {
                    commit(type.CHECK_VIDEOS, checkedVideos);
                });
            },
            [type.GET_SAVED_VIDEOS]({ commit }) {
                setTimeout(() => {
                    debugger;
                    const savedVideos = JSON.parse(localStorage.getItem('videosList')) || [];
                    commit(type.GET_SAVED_VIDEOS, savedVideos);
                }, 1000);
            },
            [type.SAVE_VIDEOS]({}, { videosToSave }) {
                localStorage.setItem('videosList', JSON.stringify(videosToSave));
            },
        },
        strict: process.env.DEV,
    });

    return Store;
}
