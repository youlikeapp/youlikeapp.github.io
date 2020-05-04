<template>
    <div v-bind:class="{ disabled: disabled }">
        <h3>Результат проверки</h3>
        <div class="q-mb-md">
            <q-chip>
                <q-avatar color="red" text-color="white">{{numberOfCheckedVideos}}</q-avatar>Всего проверено
            </q-chip>
            <q-chip>
                <q-avatar color="red" text-color="white">{{numberOfVideosWithoutLikes}}</q-avatar>Без лайков
            </q-chip>
            <q-chip>
                <q-avatar color="teal" text-color="white">{{numberOfVideosWithLikes}}</q-avatar>С лайками
            </q-chip>
            <q-btn
                v-bind:disabled="disabled"
                v-on:click="recoverLikes()"
                icon="fas fa-recycle"
                label="Поставить лайки"
                color="red"
            />
        </div>
        <q-table
            title="List of videos without likes"
            dense
            v-bind:data="videosWithoutLikes"
            v-bind:columns="columns"
            row-key="name"
        />
    </div>
</template>

<script>
import VMainContentCheckingSummaryWithoutLikes from './VMainContentCheckingSummaryWithoutLikes';

const customEvents = { recoverVideos: 'recover-videos' };

export default {
    data: function() {
        return {
            columns: [
                {
                    name: 'url',
                    required: true,
                    label: 'Video URL',
                    align: 'left',
                    field: row => row.url,
                    format: val => `${val}`,
                    sortable: false,
                },
            ],
            data: [{ url: 'abcde' }, { url: 'xyz' }, { url: '1234' }],
        };
    },
    props: {
        checkedVideos: {
            type: Object,
            default: function() {
                return { withLikes: [], withoutLikes: [] };
            },
        },
        disabled: {
            type: Boolean,
            default: function() {
                return false;
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
        videosWithoutLikes() {
            return this.checkedVideos.withoutLikes.map(url => ({ url }));
        },
    },
    componentst: {
        VMainContentCheckingSummaryWithoutLikes,
    },
    methods: {
        recoverLikes: function() {
            const videoIds = this.videosWithoutLikes.map(v => v.url);
            this.$emit(customEvents.recoverVideos, videoIds);
        },
    },
};
</script>

<style>
</style>