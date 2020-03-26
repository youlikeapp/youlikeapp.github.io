<template>
    <div>
        <button v-on:click="addVideo()">test add</button>
        <v-main-content-video-list-input
            v-bind:videos="videos"
            @check-videos="checkVideos()"
            @save-list="saveList()"
            @load-list="loadList()"
        />
        <v-main-content-recovery-summary />
        <v-main-content-video-errors />
    </div>
</template>

<script>
import VMainContentVideoListInput from './VMainContentVideoListInput';
import VMainContentRecoverySummary from './VMainContentRecoverySummary';
import VMainContentVideoErrors from './VMainContentVideoErrors';

export default {
    data: function() {
        return { videos: ['www.youtube.com/1234', 'www.youtube.com/235', 'www.youtube.com/acdef'] };
    },
    components: {
        VMainContentVideoListInput,
        VMainContentRecoverySummary,
        VMainContentVideoErrors,
    },
    methods: {
        checkVideos: function() {
            console.log('@check-videos');
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

<style>
</style>