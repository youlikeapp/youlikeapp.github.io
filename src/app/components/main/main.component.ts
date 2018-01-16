import { YouTubeService, CheckingResult } from "../../common/youtube/youtube.service";
import { blockUI, material } from "angular";
import * as toastr from "toastr";

import "./main.scss";

export class MainComponent implements ng.IComponentOptions {
    controller: ng.IControllerConstructor;
    template: string;

    constructor() {
        this.controller = MainController;
        this.template = require("./main.html");
    }
}

class MainController implements ng.IComponentController {
    private readonly bottomId: string = "bottom";
    // tslint:disable-next-line:max-line-length
    private readonly listPlaceholder: string = "Пример заполнения:\nhttps://www.youtube.com/watch?v=TadQGyFWPHc\nhttps://www.youtube.com/watch?v=DnQd2wQRoJ0\nqmLJvTiL_Rw";

    private videosList: string;
    private videosListIsEmpty: boolean;
    private lastCheckingResult: CheckingResult;
    private lastSuccessedVideos: string[];
    private lastFailedVideos: { id: string, errorMsg: string }[];

    constructor(private $scope: ng.IScope,
        private $mdDialog: material.IDialogService,
        private $mdMedia: material.IMedia,
        private youtubeService: YouTubeService,
        private blockUI: blockUI.BlockUIService,
        private $location: ng.ILocationService,
        private $anchorScroll: ng.IAnchorScrollService) {
        "ngInject";
    }

    public get hasVideosInStorage(): boolean {
        return localStorage.videosList !== undefined;
    }

    // tslint:disable-next-line:no-empty
    $onInit(): void {
        this.videosList = localStorage.videosList;
        this.videosListIsEmpty = !this.videosList || this.videosList.length === 0;

        if (this.videosListIsEmpty) {
            this.videosList = this.listPlaceholder;
        }
    }

    public checkVideos(): void {
        this.blockUI.start("Выполняется проверка...");

        this.youtubeService.checkVideos(this.videosList)
            .then((value) => {
                this.clearStats();

                this.lastCheckingResult = value;

                this.$scope.$apply(() => {
                    this.blockUI.stop();

                    if (this.$mdMedia("xs")) {
                        this.goToBottom();
                    }
                });
            }, (reason) => this.$scope.$apply(() => this.blockUI.stop()));
    }

    public setLikes(): void {
        this.blockUI.start("Выполняется проставление лайков...");

        let lastCheckingResult: CheckingResult = this.lastCheckingResult;

        this.clearStats();

        this.lastSuccessedVideos = [];
        this.lastFailedVideos = [];

        try {
            this.youtubeService.setRating(lastCheckingResult.withoutLikes, "like",
            (videoId: string) => {
                this.lastSuccessedVideos.push(videoId);

                this.$scope.$apply();
            },
            (videoId: string, errorMsg: string) => {
                this.lastFailedVideos.push({ id: videoId, errorMsg: errorMsg });

                this.$scope.$apply();
            }).then(() => this.$scope.$apply(() => this.blockUI.stop()));
        } catch {
            this.clearStats();
            this.blockUI.stop();

            this.lastCheckingResult = lastCheckingResult;
        }
    }

    public saveList(): void {
        localStorage.videosList = this.videosList;

        toastr.success("Список видео сохранён.");
    }

    public clearList(): void {
        let confirm: material.IConfirmDialog = this.$mdDialog.confirm()
            .title("Подтверждение действия")
            .textContent("Вы уверены, что хотите удалить список видео?")
            .ok("Да")
            .cancel("Нет");

        this.$mdDialog.show(confirm).then((value) => {
            localStorage.removeItem("videosList");

            toastr.success("Список видео удалён.");
        });
    }

    public loadList(): void {
        this.videosList = localStorage.videosList;
    }

    private onListFocus(): void {
        if (this.videosList === this.listPlaceholder) {
            this.videosList = null;
        }
    }

    private onListBlur(): void {
        if (!this.videosList) {
            this.videosList = this.listPlaceholder;
            this.videosListIsEmpty = true;
        }
    }

    private onListChange(): void {
        if (this.videosList) {
            this.videosListIsEmpty = false;
        } else {
            this.videosListIsEmpty = true;
        }
    }

    private clearStats(): void {
        this.lastSuccessedVideos = null;
        this.lastFailedVideos = null;
        this.lastCheckingResult = null;
    }

    private goToBottom(): void {
        this.$location.hash(this.bottomId);

        this.$anchorScroll();
    }
}