<template>
    <div>
        <button v-on:click="addVideo()">test add</button>
        <v-main-content-video-list-input
            v-bind:videos="videos"
            @check-videos="checkVideos($event)"
            @save-list="saveList"
            @load-list="loadList()"
            @remove-videos="removeVideos"
        />
        <v-main-content-recovery-summary v-bind:checkedVideos="checkedVideos" />
        <v-main-content-video-errors />
    </div>
</template>

<script>
import VMainContentVideoListInput from './VMainContentVideoListInput';
import VMainContentRecoverySummary from './VMainContentRecoverySummary';
import VMainContentVideoErrors from './VMainContentVideoErrors';

import { CHECK_VIDEOS, GET_SAVED_VIDEOS, SAVE_VIDEOS } from '../store/mutation-types';

export default {
    data: function() {
        return {
            videos: [],
            checkedVideos: {
                withLikes: [],
                withoutLikes: [],
            },
        };
    },
    components: {
        VMainContentVideoListInput,
        VMainContentRecoverySummary,
        VMainContentVideoErrors,
    },
    mounted() {
        this.$store.subscribe(({ type, payload }) => {
            if (type === CHECK_VIDEOS) {
                this.checkedVideos = payload;
            } else if (type === GET_SAVED_VIDEOS) {
                this.videos = payload;
            }
        });

        this.$store.dispatch(GET_SAVED_VIDEOS);
    },
    methods: {
        checkVideos: function(videosToCheck) {
            console.log('@check-videos', videosToCheck);
            this.$store.dispatch({ type: CHECK_VIDEOS, videosToCheck });
        },
        saveList: function(videosToSave) {
            debugger;
            this.$store.dispatch({ type: SAVE_VIDEOS, videosToSave });
        },
        loadList: function() {
            this.$store.dispatch(GET_SAVED_VIDEOS);
        },
        addVideo: function() {
            this.videos = [...this.videos, 'www.youtube.pl/xyz'];
        },
        removeVideos: function() {
            console.log('removeVideos');
        },
    },
};
</script>

<style></style>
