<template>
    <div>
        <h1>Восстановление лайков</h1>
        <div>
            <div>
                <!-- <md-content flex="70" flex-xs="100"> -->
                <div>
                    <div>
                        <!-- <md-input-container class="md-block"> -->
                        <label>Список видео (идентификаторы или полные ссылки)</label>
                        <textarea name="videosListTextArea" id cols="30" rows="10"></textarea>
                        <!-- <textarea
                                id="videosListTextArea"
                                required
                                rows="12"
                                ng-class="$ctrl.videosListIsEmpty && 'list-empty'"
                                ng-model="$ctrl.videosList"
                                ng-focus="$ctrl.onListFocus()"
                                ng-blur="$ctrl.onListBlur()"
                                ng-change="$ctrl.onListChange()"
                        ></textarea>-->
                        <!-- </md-input-container> -->
                    </div>
                    <div>
                        <button v-on:click="checkVideos()">
                            <!-- ng-disabled="$ctrl.videosListIsEmpty"
                            ng-click="$ctrl.checkVideos()"-->
                            <!-- <md-icon class="material-icons">&#xE065;</md-icon>Проверить -->
                            <span>checkVideos() Проверить</span>
                        </button>
                        <button v-on:click="saveList()">
                            <!-- ng-disabled="$ctrl.videosListIsEmpty"
                                id="saveListBtn"
                            ng-click="$ctrl.saveList()"-->
                            <!-- <md-icon class="material-icons">&#xE161;</md-icon>Сохранить -->
                            <span>saveList() Сохранить</span>
                        </button>
                        <button v-on:click="loadList()">
                            <!-- ng-if="$ctrl.hasVideosInStorage"
                            ng-click="$ctrl.loadList()"-->
                            <!-- <md-icon class="material-icons">&#xE929;</md-icon>Загрузить -->
                            <span>loadList() Загрузить</span>
                        </button>
                        <button v-on:click="deleteVideos()">
                            <!-- class="md-raised md-accent"
                                ng-if="$ctrl.hasVideosInStorage"
                            ng-click="$ctrl.showDialog('confirmDeleteDialog')"-->
                            <!-- <md-icon class="material-icons">&#xE872;</md-icon>Удалить -->
                            <span>showDialog('confirmDeleteDialog') Удалить</span>
                        </button>
                    </div>
                    <!-- </md-content> -->
                </div>
                <div>
                    <!-- <md-content ng-if="$ctrl.lastSuccessedVideos || $ctrl.lastFailedVideos"> -->
                    <h3>Результат выставления лайков</h3>
                    <p>Проставлено: $ctrl.lastSuccessedVideos.length</p>
                    <p>Не проставлено: $ctrl.lastFailedVideos.length</p>
                    <p>
                        <strong>Лайки могут появиться с задержкой.</strong>
                    </p>
                    <div>
                        ng-if="$ctrl.lastFailedVideos.length > 0"
                        <button>
                            ng-click="$ctrl.showDialog('failedVideosDialog')"
                            <!-- <md-icon class="material-icons">&#xE417;</md-icon>Показать ошибки -->
                            <span>Показать ошибки</span>
                        </button>
                    </div>
                    <!-- </md-content> -->
                </div>
                <!-- <a id="{{ $ctrl.bottomId }}"></a> -->
                a href with $ctrl.bottomId dynamic id
            </div>
        </div>
        <input id="forceUpdate" type="hidden" placeholder="on click $ctrl.forceUpdate()" />

        <hr />
        <v-main-content-video-list-input-delete />
        <hr />
    </div>
</template>

<script>
import VMainContentVideoListInputDelete from './VMainContentVideoListInputDelete';

export default {
    components: {
        VMainContentVideoListInputDelete,
    },
    methods: {
        checkVideos: function() {
            this.$emit('check-videos');
        },
        saveList: function() {
            this.$emit('save-list');
        },
        loadList: function() {
            this.$emit('load-list');
        },
        deleteVideos: function() {
            console.log('show confirmation dialog');
        },
    },
};
</script>

<style>
</style>