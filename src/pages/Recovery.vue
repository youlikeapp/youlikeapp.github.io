<template>
    <div class="q-pa-xl">
        <v-toaster
            v-model="dialog.isVisible"
            v-bind:message="dialog.message"
            v-bind:backgroundClass="dialog.backgroundClass"
        />
        <v-recovery-video-list-input
            v-bind:videos="videos"
            @check-videos="checkVideos($event)"
            @save-list="saveList"
            @load-list="loadList()"
            @remove-videos="removeVideos"
        />
        <v-recovery-checking-summary
            v-bind:disabled="!areVideosChecked"
            v-bind:checkedVideos="checkedVideos"
            @recover-videos="recoverVideos($event)"
        />
        <v-recovery-page-recovery-summary
            v-bind:disabled="!areVideosRecovered"
            v-bind:recoveredVideos="recoveredVideos"
        />
        <button @click="openDialog()">Dialog</button>
    </div>
</template>

<script>
import VRecoveryVideoListInput from '../components/VRecoveryVideoListInput';
import VRecoveryCheckingSummary from '../components/VRecoveryCheckingSummary';
import VRecoveryPageRecoverySummary from '../components/VRecoveryPageRecoverySummary';
import VToaster from '../components/VToaster';

import { CHECK_VIDEOS, GET_SAVED_VIDEOS, SAVE_VIDEOS, REMOVE_VIDEOS, RECOVER_VIDEOS } from '../store/mutation-types';

export default {
    data: function() {
        return {
            videos: [],
            checkedVideos: {
                withLikes: [],
                withoutLikes: [],
            },
            recoveredVideos: {
                successfull: [],
                failed: [],
            },
            dialog: {
                isVisible: false,
                message: '',
                backgroundClass: 'bg-secondary',
                dismissSchedule: null,
            },
        };
    },
    components: {
        VRecoveryVideoListInput,
        VRecoveryCheckingSummary,
        VRecoveryPageRecoverySummary,
        VToaster,
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
                case RECOVER_VIDEOS:
                    this.recoveredVideos = payload;
                    break;
            }
        });

        this.$store.dispatch(GET_SAVED_VIDEOS);
    },
    methods: {
        openDialog() {
            const { message, cssClass } = this.recoverySummary();
            this.dialog.message = message;
            this.dialog.backgroundClass = cssClass;
            if (this.dialog.dismissSchedule) {
                clearTimeout(this.dialog.dismissSchedule);
            }
            this.dialog.dismissSchedule = setTimeout(() => {
                this.dialog.isVisible = false;
                this.dialog.message = '';
            }, 2000);
            this.dialog.isVisible = true;
        },
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
        recoverVideos: function(videosToRecover) {
            this.$store.dispatch({ type: RECOVER_VIDEOS, videosToRecover });
        },
        recoverySummary: function() {
            const { failed, successfull } = this.recoveredVideos;
            if (failed > 0 && successfull === 0) {
                return { message: 'Sorry! None of the videos were recovered', cssClass: 'bg-red' };
            } else if (successfull > 0 && failed === 0) {
                return { message: 'Success! All of the videos were recovered', cssClass: 'bg-teal' };
            } else {
                return { message: 'Only some of the videos were recovered', cssClass: 'bg-purple' };
            }
        },
    },
    computed: {
        areVideosChecked: function() {
            return !!this.checkedVideos.withLikes.length || !!this.checkedVideos.withoutLikes.length;
        },
        areVideosRecovered: function() {
            return !!this.recoveredVideos.successfull.length || !!this.recoveredVideos.failed.length;
        },
    },
};
</script>

<style></style>
