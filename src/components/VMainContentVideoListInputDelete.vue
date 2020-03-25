<template>
    <div style="background-color: lightgrey" class="dialog-container">
        <div id="confirmDeleteDialog">
            <div>
                <!-- <md-dialog
                    md-theme="default"
                    aria-label="Подтверждение действия"
                    ng-class="dialog.css"
                    role="dialog"
                    tabindex="-1"
                >-->
                <div>
                    <!-- <md-dialog-content class="md-dialog-content" role="document" tabindex="-1"> -->
                    <h2>Подтверждение действия</h2>
                    <div>
                        <p>Вы уверены, что хотите удалить список видео?</p>
                    </div>
                </div>
                <!-- </md-dialog-content> -->
                <!-- <md-dialog-actions> -->
                <div>
                    <button class="md-primary md-cancel-button">
                        ng-click="$ctrl.closeDialog()"
                        <span>Нет</span>
                    </button>
                    <button>
                        ng-click="$ctrl.clearList()"
                        <span>Да</span>
                    </button>
                </div>
                <!-- </md-dialog-actions> -->
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