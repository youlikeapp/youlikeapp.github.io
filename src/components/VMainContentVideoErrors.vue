<template>
    <div class="dialog-container">
        <div class="md-dialog-container" id="failedVideosDialog">
            <!-- <md-dialog
                    md-theme="default"
                    aria-label="Список видео, на которых не удалось восстановить лайки"
                    ng-class="dialog.css"
                    role="dialog"
                    tabindex="-1"
            >-->
            <div>
                <!-- <md-toolbar class="md-toolbar-tools"> -->
                <div>
                    <h2>Ошибки</h2>
                    <span></span>
                    <button>
                        ng-click="$ctrl.closeDialog()"
                        <!-- <md-icon class="material-icons">&#xE5CD;</md-icon> -->
                        icon
                    </button>
                </div>
                <!-- </md-toolbar> -->
                <!-- <md-dialog-content class="md-dialog-content" role="document" tabindex="-1"> -->
                <div>
                    <!-- <md-list> -->
                    <ul>
                        <!-- <md-list-item ng-repeat="video in $ctrl.lastFailedVideosShown"> -->
                        <li>
                            <p>
                                failed videos list
                                <!-- <a
                                        ng-href="https://www.youtube.com/watch?v={{ ::video.id }}"
                                        target="_blank"
                                    >{{ video.id }}</a>
                                : {{ video.errorMsg || "Неизвестная ошибка" }}-->
                            </p>
                        </li>
                        <!-- </md-list-item> -->
                    </ul>
                    <!-- </md-list> -->
                    <span>pagination for failed videos</span>
                    <!-- <md-collection-pagination
                            ng-if="$ctrl.lastFailedVideos"
                            collection="$ctrl.lastFailedVideos"
                            paginated-collection="$ctrl.lastFailedVideosShown"
                    ></md-collection-pagination>-->
                </div>
                <!-- </md-dialog-content> -->
            </div>
            <!-- </md-dialog> -->
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style>
</style>