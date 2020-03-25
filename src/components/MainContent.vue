<template>
    <div>
        <v-main-content-video-list-input
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
    },
};
</script>

<style>
</style>