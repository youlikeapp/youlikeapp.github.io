import * as toastr from 'toastr';
import { blockUI, material } from 'angular';
import { YouTubeService, CheckingResult, YoutubeCommentsCheckResult } from '../../common/youtube/youtube.service';

import './likes.scss';
import * as _ from 'lodash';
import * as queryString from 'query-string';
import * as validator from 'validator';
import moment = require('moment');
import { VideoListService } from '../videolist/videoListService';

export class LikesComponent implements ng.IComponentOptions {
    public controller: ng.IControllerConstructor;
    public template: string;

    constructor() {
        this.controller = LikesController;
        this.template = require('./likes.html');
    }
}

class LikesController implements ng.IComponentController {
    private readonly bottomId: string = 'bottom';
    private lastCheckingResult: CheckingResult;
    private lastSuccessedVideos: string[];
    private lastFailedVideos: { id: string; errorMsg: string }[];

    constructor(
        private $scope: ng.IScope,
        private $mdDialog: material.IDialogService,
        private $mdMedia: material.IMedia,
        private youtubeService: YouTubeService,
        private blockUI: blockUI.BlockUIService,
        private $location: ng.ILocationService,
        private $anchorScroll: ng.IAnchorScrollService,
        private videoListService: VideoListService
    ) {
        'ngInject';
    }

    public get hasVideosInStorage(): boolean {
        return this.videoListService.hasVideoInStorage();
    }

    public checkVideos(): void {
        this.blockUI.start({ message: 'Выполняется проверка...', template: 'likes' });

        this.youtubeService.checkVideos(this.videoListService.videosList).then(
            value => {
                this.clearStats();

                this.lastCheckingResult = value;

                this.$scope.$apply(() => {
                    this.blockUI.stop();

                    if (this.$mdMedia('xs')) {
                        this.goToBottom();
                    }
                });
            },
            reason => this.$scope.$apply(() => this.blockUI.stop())
        );
    }

    public setLikes(): void {
        this.blockUI.start('Выполняется проставление лайков...');

        let lastCheckingResult: CheckingResult = this.lastCheckingResult;

        this.clearStats();

        this.lastSuccessedVideos = [];
        this.lastFailedVideos = [];

        try {
            this.youtubeService
                .setRating(
                    lastCheckingResult.withoutLikes,
                    'like',
                    (videoId: string) => {
                        this.lastSuccessedVideos.push(videoId);

                        this.$scope.$apply();
                    },
                    (videoId: string, errorMsg: string) => {
                        this.lastFailedVideos.push({ id: videoId, errorMsg: errorMsg });

                        this.$scope.$apply();
                    }
                )
                .then(() => this.$scope.$apply(() => this.blockUI.stop()));
        } catch {
            this.clearStats();
            this.blockUI.stop();

            this.lastCheckingResult = lastCheckingResult;
        }
    }

    public saveList(): void {
        this.videoListService.saveList();
        toastr.success('Список видео сохранён.');
    }

    public showDialog(id: string): void {
        this.$mdDialog.show({
            contentElement: `#${id}`,
            parent: document.body
        });
    }

    public closeDialog(): void {
        this.$mdDialog.hide();
    }

    public clearList(): void {
        this.$mdDialog.hide();
        this.videoListService.clearList();
        toastr.success('Список видео удалён.');
    }

    public loadList(): void {
        this.videoListService.loadList();
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

    private forceUpdate(): void {
        this.$scope.$eval();
    }
}
