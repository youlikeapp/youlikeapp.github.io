<template>
    <div>
        <div>
            <h1>Восстановление лайков</h1>
            <div>
                <label>Список видео (идентификаторы или полные ссылки)</label>
                <q-input
                    v-model.trim="$v.videosString.$model"
                    filled
                    autogrow
                    placeholder="placeholder to be filled in"
                />
                <div class="error" v-if="!$v.videosString.required">Field is required</div>
                <div
                    class="error"
                    v-if="$v.videosString.required && !$v.videosString.commaSeparatedListOfUrlsOrVideoIds"
                >YouTube url or video id invalid</div>
            </div>
            <div class="q-pa-md q-gutter-sm">
                <q-btn
                    v-on:click="checkVideos()"
                    v-bind:disabled="$v.$invalid"
                    icon="fas fa-tasks"
                    label="Проверить"
                    color="primary"
                />
                <q-btn
                    v-on:click="saveList()"
                    v-bind:disabled="$v.$invalid"
                    icon="fas fa-save"
                    label="Сохранить"
                    color="secondary"
                />
                <q-btn
                    v-on:click="loadList()"
                    v-if="!isListEmpty"
                    icon="fas fa-file-download"
                    label="Загрузить"
                    color="red"
                />
                <q-btn
                    v-on:click="showDeleteConfirmationModal()"
                    v-if="!isListEmpty"
                    icon="fas fa-trash-alt"
                    label="Удалить"
                    color="purple"
                />
            </div>
        </div>

        <v-recovery-video-list-input-modal-delete-confirmation
            v-bind:modal-visible="isDeleteModalVisible"
            @close="closeModal"
        />
    </div>
</template>

<script>
import VRecoveryVideoListInputModalDeleteConfirmation from './VRecoveryVideoListInputModalDeleteConfirmation';
import { required } from 'vuelidate/lib/validators';
import { commaSeparatedListOfUrlsOrVideoIds } from '../services/form-validator.service';

const customEvents = { checkVideos: 'check-videos', saveList: 'save-list', loadList: 'load-list', removeVideos: 'remove-videos' };

export default {
    props: {
        videos: Array,
    },
    data: function() {
        return { videosString: '', isDeleteModalVisible: false };
    },
    validations: {
        videosString: { required, commaSeparatedListOfUrlsOrVideoIds },
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
        VRecoveryVideoListInputModalDeleteConfirmation,
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
