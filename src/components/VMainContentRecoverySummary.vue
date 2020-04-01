<template>
    <div style="background-color: lightgrey">
        <!-- <md-content ng-if="$ctrl.lastCheckingResult"> -->
        <h3>Результат проверки</h3>
        <p>Всего проверено: {{numberOfCheckedVideos}}</p>
        <p>С лайками: {{numberOfVideosWithLikes}}</p>
        <p>Без лайков: {{numberOfVideosWithoutLikes}}</p>
        <div>
            <!-- ng-if="$ctrl.lastCheckingResult.withoutLikes.length > 0" -->
            <button>
                <!-- ng-click="$ctrl.showDialog('videosWithoutLikesDialog')" -->
                <!-- <md-icon class="material-icons">&#xE417;</md-icon> -->
                $ctrl.showDialog('videosWithoutLikesDialog')
                <span>Показать видео без лайков</span>
            </button>
            <button>
                $ctrl.setLikes()
                <!-- <md-icon class="material-icons">&#xE8DC;</md-icon>Поставить лайки -->
                <span>Поставить лайки</span>
            </button>
        </div>
        <v-main-content-recovery-summary-without-likes />
    </div>
</template>

<script>
import VMainContentRecoverySummaryWithoutLikes from './VMainContentRecoverySummaryWithoutLikes';

export default {
    props: {
        checkedVideos: {
            type: Object,
            default: function() {
                return { withLikes: [], withoutLikes: [] };
            },
        },
    },
    computed: {
        numberOfVideosWithLikes() {
            return this.checkedVideos.withLikes.length;
        },
        numberOfVideosWithoutLikes() {
            return this.checkedVideos.withoutLikes.length;
        },
        numberOfCheckedVideos() {
            return this.numberOfVideosWithLikes + this.numberOfVideosWithoutLikes;
        },
    },
    componentst: {
        VMainContentRecoverySummaryWithoutLikes,
    },
};
</script>

<style>
</style>