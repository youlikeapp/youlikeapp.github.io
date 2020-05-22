<template>
    <div>
        <div>
            <div>
                <!-- <md-dialog
                    md-theme="default"
                    aria-label="Список видео без лайков"
                    ng-class="dialog.css"
                    role="dialog"
                    tabindex="-1"
                >-->
                <!-- <md-toolbar class="md-toolbar-tools"> -->
                <div>
                    <h2>Список видео без лайков</h2>
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
                    <div>
                        <div>list of items: lastCheckingResult.withoutLikesShown</div>
                        <!-- <md-list-item
                                ng-repeat="video in $ctrl.lastCheckingResult.withoutLikesShown"
                            >
                                <a
                                    ng-href="https://www.youtube.com/watch?v={{ ::video }}"
                                    target="_blank"
                                >https://www.youtube.com/watch?v={{ ::video }}</a>
                        </md-list-item>-->
                    </div>
                    <!-- </md-list> -->
                    <span>pagination</span>
                    <!-- <md-collection-pagination
                            ng-if="$ctrl.lastCheckingResult.withoutLikes"
                            collection="$ctrl.lastCheckingResult.withoutLikes"
                            paginated-collection="$ctrl.lastCheckingResult.withoutLikesShown"
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