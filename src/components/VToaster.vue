<template>
    <q-dialog v-model="isVisible" v-bind:position="'top'">
        <q-card style="width: 350px" v-bind:class="backgroundClass">
            <q-card-section class="row items-center no-wrap">
                <div>
                    <div class="text-weight-bold">{{message}}</div>
                </div>
                <q-space />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
export default {
    props: {
        value: Boolean,
        message: String,
        backgroundClass: String,
    },
    data: function() {
        return {
            isVisible: this.value,
        };
    },
    watch: {
        value: function() {
            this.isVisible = this.value;
        },
    }
};
</script>

<style>
</style>