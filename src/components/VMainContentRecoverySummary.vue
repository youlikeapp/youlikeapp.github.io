<template>
    <div>
        <!-- <md-content ng-if="$ctrl.lastCheckingResult"> -->
        <h3>Результат проверки</h3>
        <p>Всего проверено: $ctrl.lastCheckingResult.withLikes.length + $ctrl.lastCheckingResult.withoutLikes.length</p>
        <p>С лайками: $ctrl.lastCheckingResult.withLikes.length</p>
        <p>Без лайков: $ctrl.lastCheckingResult.withoutLikes.length</p>
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
    componentst: {
        VMainContentRecoverySummaryWithoutLikes,
    },
};
</script>

<style>
</style>