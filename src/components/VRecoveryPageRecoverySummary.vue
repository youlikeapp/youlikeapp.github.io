<template>
    <div>
        <h3>Результат выставления лайков</h3>
        <strong>Лайки могут появиться с задержкой.</strong>
        <div class="q-pa-md">
            <p>Проставлено: {{ numberOfSuccessfullVideos }}</p>
            <q-table
                title="List of recovered videos"
                dense
                v-bind:data="recoveredVideosTableList"
                v-bind:columns="columns"
                row-key="name"
            />
        </div>
        <div class="q-pa-md">
            <p>Не проставлено: {{ numberOfFailedVideos }}</p>
            <q-table
                title="List of unrecovered videos"
                dense
                v-bind:data="failedVideosTableList"
                v-bind:columns="columns"
                row-key="name"
            />
        </div>
    </div>
</template>

<script>
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
        recoveredVideos: {
            type: Object,
            default: function() {
                return { successfull: [], failed: [] };
            },
        },
    },
    computed: {
        numberOfSuccessfullVideos() {
            return this.recoveredVideos.successfull.length;
        },
        numberOfFailedVideos() {
            return this.recoveredVideos.failed.length;
        },

        recoveredVideosTableList() {
            return this.recoveredVideos.successfull.map(url => ({ url: url }));
        },
        failedVideosTableList() {
            return this.recoveredVideos.failed.map(url => ({ url: url }));
        },
    },
};
</script>

<style>
</style>