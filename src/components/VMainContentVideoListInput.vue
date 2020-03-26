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
                        <q-input v-model="videosString" filled autogrow />
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
                        <div class="q-pa-md q-gutter-sm">
                            <q-btn v-on:click="checkVideos()" v-bind:disabled="isListEmpty" icon="fas fa-tasks" label="Проверить" color="primary" />
                            <q-btn v-on:click="saveList()" v-bind:disabled="isListEmpty" icon="fas fa-save" label="Сохранить" color="secondary" />
                            <q-btn v-on:click="loadList()" v-if="!isListEmpty" icon="fas fa-file-download" label="Загрузить" color="red" />
                            <q-btn v-on:click="deleteVideos()" v-if="!isListEmpty" icon="fas fa-trash-alt" label="Удалить" color="purple" />
                        </div>
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
    props: {
        videos: Array,
    },
    watch: {
        videos: {
            immediate: true,
            handler(newVideos) {
                this.videosString = newVideos.join(', ');
            },
        },
    },
    data: function() {
        return { videosString: '' };
    },
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
    computed: {
        isListEmpty: function() {
            return this.videosString == null || this.videosString == '';
        },
    },
};
</script>

<style></style>
