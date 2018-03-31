import * as toastr from 'toastr';
import { blockUI, material } from 'angular';
import { YouTubeService, BotComment } from '../../common/youtube/youtube.service';

import './commentsCheck.scss';
import * as _ from 'lodash';
import * as queryString from 'query-string';
import * as validator from 'validator';
import moment = require('moment');
import { StoredVideoCheckResult, VideoListService } from '../videolist/videoListService';

export class CommentsCheckComponent implements ng.IComponentOptions {
    public controller: ng.IControllerConstructor;
    public template: string;

    constructor() {
        this.controller = CommentsCheckController;
        this.template = require('./commentsCheck.html');
    }
}

export class VideoToCheck {
    public videoId: string;
    public lastCheck: Date;
    public commentsChecked: number;

    constructor(videoId: string, lastCheck: Date, commentsChecked: number) {
        this.videoId = videoId;
        this.lastCheck = lastCheck;
        this.commentsChecked = commentsChecked;
    }
}

export class CheckResults {
    public videoId: string;
    public botComments: BotComment[] = [];
    public lastCheck: Date;
    public selected: boolean = true;
    public commentsChecked: number = 0;

    constructor(videoId: string, lastCheck: Date, botComments?: BotComment[], commentsChecked?: number) {
        this.videoId = videoId;
        this.lastCheck = lastCheck;
        if (botComments) {
            this.botComments = botComments;
        }
        if (commentsChecked) {
            this.commentsChecked = commentsChecked;
        }
    }

    public lastCheckTimeString() {
        return this.lastCheck ? moment(this.lastCheck).format('DD.MM.YYYY, HH:mm:ss') : '';
    }
}

class CommentsCheckController implements ng.IComponentController {
    private readonly bottomId: string = 'bottom';
    // tslint:disable-next-line:max-line-length
    private checkResults: CheckResults[] = [];
    private saveBtnClickDisabled: boolean = false;
    private checkCancel: any;

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

    public anyBotVideoIsSelected(): boolean {
        return (
            this.checkResults.filter(checkResult => checkResult.selected && checkResult.botComments.length).length > 0
        );
    }

    public async fullRecheck() {
        // this.clearStats();
        const videoIds = this.checkResults
            .filter(item => item.selected)
            .map(item => new VideoToCheck(item.videoId, null, 0));

        const youtubeCheck$ = await this.youtubeService.commentsCheck(videoIds, true);
        this.blockUI.start({ template: 'commentsCheck' });
        youtubeCheck$.subscribe(
            youtubeCheckResult => {
                // this.clearStats();
                const storageUpdates: { [id: string]: StoredVideoCheckResult } = {};
                youtubeCheckResult.filter(item => !item.error).map(item => {
                    const oldCheckResult = this.checkResults.find(checkResult => checkResult.videoId === item.videoId);
                    if (oldCheckResult) {
                        oldCheckResult.botComments = item.botComments;
                        oldCheckResult.lastCheck = item.mostFreshCommentChecked;
                        storageUpdates[oldCheckResult.videoId] = new StoredVideoCheckResult(
                            oldCheckResult.botComments,
                            oldCheckResult.lastCheck,
                            oldCheckResult.commentsChecked
                        );
                    }
                });

                const storedData: { [videoId: string]: StoredVideoCheckResult } = JSON.parse(localStorage.videosList);
                for (const videoId in storedData) {
                    storedData[videoId] = storageUpdates[videoId] || storedData[videoId];
                }

                this.videoListService.suspendWatch();

                localStorage.videosList = JSON.stringify(storedData);

                this.$scope.$apply(() => {
                    this.blockUI.stop();

                    if (this.$mdMedia('xs')) {
                        this.goToBottom();
                    }
                });
                this.videoListService.resumeWatch();
                toastr.success('Готово.');
            },
            error => {
                // console.log(error);
                this.$scope.$apply(() => this.blockUI.stop());
            }
        );
    }

    public skipVideoInCheck() {
        console.log('mark current video checked in checkResult as error, check next video');
    }

    public cancelCheck() {
        console.log('mark current video checked in checkResult as error, sets checkResult, closes blockUI');
    }

    public async commentsCheck() {
        this.clearStats();

        // this.showDialog('checkStatusDialog');
        // this.blockUI.start();
        // this.blockUI.message({idiNah: this.checkCancel})

        let displayedVideoList: string[] = this.videoListService.videosList.split('\n');
        const storedCheckResults: { [displayId: string]: { [videoId: string]: StoredVideoCheckResult } } = {};
        let videoIds: VideoToCheck[] = _.uniq(
            displayedVideoList.map(videoFromList => {
                let videoId;
                if (validator.isURL(videoFromList)) {
                    videoId = queryString.parse(queryString.extract(videoFromList)).v;
                } else {
                    videoId = videoFromList;
                }
                const storedResult = this.videoListService.getStoredResult(videoId);
                if (!storedCheckResults[videoFromList]) {
                    storedCheckResults[videoFromList] = { [videoId]: storedResult };
                }
                return new VideoToCheck(
                    videoId,
                    storedResult ? storedResult.lastBotCheck : null,
                    storedResult ? storedResult.commentsChecked : 0
                );
            })
        );

        const youtubeCheck$ = await this.youtubeService.commentsCheck(videoIds, false);
        this.blockUI.start({ template: 'commentsCheck' });
        // const stopButton = document.querySelector('#stopCommentsCheck');
        // console.log('stopButton = ', stopButton);
        // const stopCheck$ = Rx.Observable.fromEvent(stopButton, 'click');
        youtubeCheck$
            // .takeUntil(stopCheck$)
            .subscribe(
                youtubeCheckResult => {
                    console.log('comments check youtubeCheckResult = ', youtubeCheckResult);
                    this.clearStats();
                    const checkResults: CheckResults[] = [];
                    youtubeCheckResult.filter(item => !item.error).map(item => {
                        const storedCheckResult = this.videoListService.getCheckResults(item.videoId);
                        checkResults.push(
                            new CheckResults(
                                item.videoId,
                                item.mostFreshCommentChecked,
                                [...item.botComments, ...storedCheckResult.botComments],
                                storedCheckResult.commentsChecked + item.commentsForCheck
                            )
                        );
                    });

                    this.checkResults = checkResults;

                    const checkResultsByIdMap: { [videoId: string]: CheckResults } = {};
                    checkResults.forEach(checkResult => {
                        checkResultsByIdMap[checkResult.videoId] = checkResult;
                    });

                    const updatedItems: { [id: string]: StoredVideoCheckResult }[] = Object.keys(
                        storedCheckResults
                    ).map(displayedVideoId => {
                        const videoId = Object.keys(storedCheckResults[displayedVideoId])[0];
                        const storedCheckResult = storedCheckResults[displayedVideoId][videoId];
                        const newCheckResult = checkResultsByIdMap[videoId];
                        const comments =
                            (newCheckResult && newCheckResult.botComments) ||
                            ((storedCheckResult && storedCheckResult.comments) || []);
                        const lastCheck =
                            (newCheckResult && newCheckResult.lastCheck) ||
                            ((storedCheckResult && storedCheckResult.lastBotCheck) || null);
                        const commentsChecked =
                            (newCheckResult && newCheckResult.commentsChecked) ||
                            ((storedCheckResult && storedCheckResult.commentsChecked) || 0);
                        return {
                            [displayedVideoId]: new StoredVideoCheckResult(comments, lastCheck, commentsChecked)
                        };
                    });

                    this.videoListService.suspendWatch();

                    localStorage.videosList = JSON.stringify(updatedItems);

                    this.synchronizeWithChromeExtension();

                    this.$scope.$apply(() => {
                        this.blockUI.stop();

                        if (this.$mdMedia('xs')) {
                            this.goToBottom();
                        }
                    });
                    this.videoListService.resumeWatch();
                },
                error => {
                    console.log('comment check subscribe error', error);
                    this.$scope.$apply(() => this.blockUI.stop());
                },
                () => {
                    console.log('complete');
                }
            );
    }

    private synchronizeWithChromeExtension() {
        const saveBtn: HTMLElement = document.querySelector('#saveListBtn');
        this.saveBtnClickDisabled = true;
        saveBtn.click();
        this.saveBtnClickDisabled = false;
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

    private goToBottom(): void {
        this.$location.hash(this.bottomId);

        this.$anchorScroll();
    }

    private forceUpdate(): void {
        this.$scope.$eval();
    }

    private clearStats() {
        this.checkResults = [];
    }

    public isNoneSelected() {
        return this.checkResults.filter(item => item.selected).length === 0;
    }

    public isSelectAllChecked() {
        const selectedItems = this.checkResults.filter(item => item.selected);
        return selectedItems.length === this.checkResults.length;
    }

    public isIndeterminate() {
        const selectedItems = this.checkResults.filter(item => item.selected);
        return selectedItems.length && selectedItems.length !== this.checkResults.length;
    }

    public toggleSelectAll() {
        if (this.isSelectAllChecked()) {
            this.checkResults.map(item => (item.selected = false));
        } else {
            this.checkResults.map(item => (item.selected = true));
        }
    }

    public toggleSelected(checkResult) {
        checkResult.selected = !checkResult.selected;
    }

    public async banBots() {
        const selectedWithBots = this.checkResults.filter(item => item.selected && item.botComments.length > 0);
        try {
            const videosWithBanComplete = await this.youtubeService.banBotComments(selectedWithBots);

            if (videosWithBanComplete.length === 0) {
                return;
            }

            videosWithBanComplete.map(checkResult => {
                checkResult.botComments = [];
            });

            const storedData: (string | { [videoId: string]: StoredVideoCheckResult })[] = JSON.parse(
                localStorage.videosList
            );

            const updatedStoredData = storedData.map(item => {
                const videoId = Object.keys(item)[0];
                const parsedId = validator.isURL(videoId) ? queryString.parse(queryString.extract(videoId)).v : videoId;
                const inBanned = videosWithBanComplete.find(checkResult => checkResult.videoId === parsedId);
                if (inBanned) {
                    const storedValue = item[videoId];
                    return { [videoId]: { ...storedValue, comments: [] } };
                }
                return item;
            });

            this.videoListService.suspendWatch();
            localStorage.videosList = JSON.stringify(updatedStoredData);
            this.synchronizeWithChromeExtension();
            this.videoListService.resumeWatch();

            toastr.success('Успешно! Кремлеботы сосать!');
        } catch (error) {
            toastr.error(`Возникли неполадки при выполнении операции: ${error.message}`);
        }
    }
}
