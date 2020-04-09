<template>
    <div class="q-pa-xl">
        <v-main-content-video-list-input
            v-bind:videos="videos"
            @check-videos="checkVideos($event)"
            @save-list="saveList"
            @load-list="loadList()"
            @remove-videos="removeVideos"
        />
        <v-main-content-checking-summary v-bind:checkedVideos="checkedVideos" />
        <v-recovery-page-recovery-summary v-bind:recoveredVideos="recoveredVideos" />
        <!-- <v-main-content-video-errors /> -->
    </div>
</template>

<script>
import VMainContentVideoListInput from '../components/VMainContentVideoListInput';
import VMainContentCheckingSummary from '../components/VMainContentCheckingSummary';
// import VMainContentVideoErrors from '../components/VMainContentVideoErrors';
import VRecoveryPageRecoverySummary from '../components/VRecoveryPageRecoverySummary';

import { CHECK_VIDEOS, GET_SAVED_VIDEOS, SAVE_VIDEOS, REMOVE_VIDEOS } from '../store/mutation-types';

export default {
    data: function() {
        return {
            videos: [],
            checkedVideos: {
                withLikes: [],
                withoutLikes: [],
            },
            recoveredVideos: {
                successfull: ['youtube.com.pl/1234', 'youtube.com.pl/acded', 'youtube.com.pl/vbsj'],
                failed: ['youtube.com.pl/1234', 'youtube.com.pl/xyzas'],
            },
        };
    },
    components: {
        VMainContentVideoListInput,
        VMainContentCheckingSummary,
        // VMainContentVideoErrors,
        VRecoveryPageRecoverySummary,
    },
    mounted() {
        this.$store.subscribe(({ type, payload }) => {
            switch (type) {
                case CHECK_VIDEOS:
                    this.checkedVideos = payload;
                    break;
                case GET_SAVED_VIDEOS:
                case REMOVE_VIDEOS:
                case SAVE_VIDEOS:
                    this.videos = payload;
                    break;
            }
        });

        this.$store.dispatch(GET_SAVED_VIDEOS);
    },
    methods: {
        checkVideos: function(videosToCheck) {
            this.$store.dispatch({ type: CHECK_VIDEOS, videosToCheck });
        },
        saveList: function(videosToSave) {
            this.$store.dispatch({ type: SAVE_VIDEOS, videosToSave });
        },
        loadList: function() {
            this.$store.dispatch(GET_SAVED_VIDEOS);
        },
        removeVideos: function() {
            this.$store.dispatch({ type: REMOVE_VIDEOS });
        },
    },
};
</script>

<style></style>
