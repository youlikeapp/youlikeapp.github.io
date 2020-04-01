<template>
    <div>
        <button v-on:click="addVideo()">test add</button>
        <v-main-content-video-list-input
            v-bind:videos="videos"
            @check-videos="checkVideos($event)"
            @save-list="saveList()"
            @load-list="loadList()"
        />
        <v-main-content-recovery-summary v-bind:checkedVideos="checkedVideos" />
        <v-main-content-video-errors />
    </div>
</template>

<script>
import VMainContentVideoListInput from './VMainContentVideoListInput';
import VMainContentRecoverySummary from './VMainContentRecoverySummary';
import VMainContentVideoErrors from './VMainContentVideoErrors';

import { CHECK_VIDEOS } from '../store/mutation-types';

export default {
    data: function() {
        return {
            videos: ['https://www.youtube.com/watch?v=T4Df5_cojAs', 'https://www.youtube.com/watch?v=b5xlL-C53f8'],
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
            }
        });
    },
    methods: {
        checkVideos: function(videosToCheck) {
            console.log('@check-videos', videosToCheck);
            this.$store.dispatch({ type: CHECK_VIDEOS, videosToCheck });
        },
        saveList: function() {
            console.log('@save-list');
        },
        loadList: function() {
            console.log('@load-list');
        },
        addVideo: function() {
            this.videos = [...this.videos, 'www.youtube.pl/xyz'];
        },
    },
};
</script>

<style></style>
