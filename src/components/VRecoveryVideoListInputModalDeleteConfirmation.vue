<template>
    <q-dialog v-model="visible" persistent>
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="fas fa-trash-alt" color="primary" text-color="white" />
                <span class="q-ml-sm">Вы уверены, что хотите удалить список видео?</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn
                    flat
                    label="Нет"
                    color="primary"
                    @click="deleteConfirmed = false"
                    v-close-popup
                />
                <q-btn
                    flat
                    label="Да"
                    color="primary"
                    @click="deleteConfirmed = true"
                    v-close-popup
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
const customEvents = { close: 'close' };

export default {
    props: {
        modalVisible: Boolean,
    },
    data: function() {
        return {
            deleteConfirmed: Boolean,
        };
    },
    methods: {
        close: function() {
            this.$emit(customEvents.close, { deleteConfirmed: this.deleteConfirmed });
        },
    },
    computed: {
        visible: {
            get: function() {
                return this.modalVisible;
            },
            set: function() {
                this.close();
            },
        },
    },
};
</script>

<style></style>
