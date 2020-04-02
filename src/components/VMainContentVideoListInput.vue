<template>
    <div>
        <div>
            <h1>Восстановление лайков</h1>
            <div>
                <label>Список видео (идентификаторы или полные ссылки)</label>
                <q-input v-model.trim="$v.videosString.$model" filled autogrow placeholder="placeholder to be filled in" />
                <div class="error" v-if="!$v.videosString.required">Field is required</div>
            </div>
            <div class="q-pa-md q-gutter-sm">
                <q-btn v-on:click="checkVideos()" v-bind:disabled="isListEmpty" icon="fas fa-tasks" label="Проверить" color="primary" />
                <q-btn v-on:click="saveList()" v-bind:disabled="isListEmpty" icon="fas fa-save" label="Сохранить" color="secondary" />
                <q-btn v-on:click="loadList()" v-if="!isListEmpty" icon="fas fa-file-download" label="Загрузить" color="red" />
                <q-btn v-on:click="showDeleteConfirmationModal()" v-if="!isListEmpty" icon="fas fa-trash-alt" label="Удалить" color="purple" />
            </div>
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
        <input id="forceUpdate" type="hidden" placeholder="on click $ctrl.forceUpdate()" />

        <v-main-content-video-list-input-modal-delete-confirmation v-bind:modal-visible="isDeleteModalVisible" @close="closeModal" />
    </div>
</template>

<script>
import VMainContentVideoListInputModalDeleteConfirmation from './VMainContentVideoListInputModalDeleteConfirmation';
import { required } from 'vuelidate/lib/validators';

const customEvents = { checkVideos: 'check-videos', saveList: 'save-list', loadList: 'load-list', removeVideos: 'remove-videos' };

export default {
    props: {
        videos: Array,
    },
    data: function() {
        return { videosString: '', isDeleteModalVisible: false };
    },
    validations: {
        videosString: { required },
    },
    watch: {
        videos: {
            immediate: true,
            handler(newVideos) {
                this.videosString = newVideos.join(', ');
            },
        },
    },
    components: {
        VMainContentVideoListInputModalDeleteConfirmation,
    },
    methods: {
        checkVideos: function() {
            const videos = this.videosString.split(',').map(video => video.trim());
            this.$emit(customEvents.checkVideos, videos);
        },
        saveList: function() {
            const videos = this.videosString.split(',').map(video => video.trim());
            this.$emit(customEvents.saveList, videos);
        },
        loadList: function() {
            this.$emit(customEvents.loadList);
        },
        showDeleteConfirmationModal: function() {
            this.isDeleteModalVisible = true;
        },
        closeModal: function({ deleteConfirmed }) {
            this.isDeleteModalVisible = false;
            if (deleteConfirmed) {
                this.$emit(customEvents.removeVideos);
            }
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
