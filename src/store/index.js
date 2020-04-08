import Vue from 'vue';
import Vuex from 'vuex';

import * as type from './mutation-types';

import googleApiService from '../services/google-api.service';
import youtubeRatingService from '../services/youtube-rating.service';
import storageService from '../services/storage.service';

Vue.use(Vuex);

const videosStorageKey = 'videosList';

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

const mutations = {
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
    [type.REMOVE_VIDEOS](state, removedVideos) {
        state.savedVideos = removedVideos;
    },
    [type.SAVE_VIDEOS](state, savedVideos) {
        state.savedVideos = savedVideos;
    },
};

const actions = {
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
    [type.LOG_OFF]({ commit }) {
        googleApiService.logOff().then(() => {
            commit(type.LOG_OFF, { ...initialState.user });
        });
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
            storageService.get(videosStorageKey).then(res => {
                const savedVideos = res || [];
                commit(type.GET_SAVED_VIDEOS, savedVideos);
            });
        }, 1000);
    },
    [type.SAVE_VIDEOS]({ commit }, { videosToSave }) {
        storageService.save(videosStorageKey, videosToSave).then(result => {
            commit(type.SAVE_VIDEOS, result);
        });
    },
    [type.REMOVE_VIDEOS]({ commit }) {
        storageService.remove(videosStorageKey).then(result => {
            commit(type.REMOVE_VIDEOS, result || []);
        });
    },
};

export default function(/* { ssrContext } */) {
    return new Vuex.Store({
        state: { ...initialState },
        mutations,
        actions,
        strict: process.env.DEV,
    });
}
