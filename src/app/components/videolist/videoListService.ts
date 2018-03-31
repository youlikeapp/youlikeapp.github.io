import * as queryString from 'query-string';
import * as validator from 'validator';
import { BotComment } from '../../common/youtube/youtube.service';
import { CheckResults } from '../comments/commentsCheck';
import { unionBy, union } from 'lodash';

export class StoredVideoCheckResult {
    public comments: BotComment[] = [];
    public lastBotCheck: Date = null;
    public commentsChecked = 0;

    constructor(comments?: BotComment[], lastCheck?: Date, commentsChecked?: number) {
        this.comments = comments || [];
        this.lastBotCheck = lastCheck || null;
        this.commentsChecked = commentsChecked || 0;
    }
}

export class VideoListService {
    public videosList: string;
    public videosListIsEmpty: boolean;
    public readonly listPlaceholder: string = 'Пример заполнения:\nhttps://www.youtube.com/watch?v=TadQGyFWPHc\nhttps://www.youtube.com/watch?v=DnQd2wQRoJ0\nqmLJvTiL_Rw';
    private removeWatchFn: () => void;
    private watcherScope: ng.IScope;

    public suspendWatch(): void {
        this.removeWatchFn();
    }

    public resumeWatch() {
        this.watcherScope.$watch(() => localStorage.videosList, this.localStorageWatchFn.bind(this));
    }

    public startWatch($scope: ng.IScope) {
        this.watcherScope = $scope;
        this.removeWatchFn = $scope.$watch(() => localStorage.videosList, this.localStorageWatchFn.bind(this));
    }

    public localStorageWatchFn(newValue, oldValue) {
        if (localStorage.videosList) {
            const storedIds = [];
            JSON.parse(newValue).map(item => {
                if (typeof item === 'object') {
                    const id = Object.keys(item)[0];
                    storedIds.push(id);
                } else if (typeof item === 'string') {
                    storedIds.push(item);
                }
            });

            const displayedList = this.videosList ? this.videosList.split('\n') : [];

            this.videosList = union(displayedList, storedIds).join('\n');
        } else {
            this.videosList = undefined;
        }

        this.videosListIsEmpty = !this.videosList || this.videosList.length === 0;

        if (this.videosListIsEmpty) {
            this.videosList = this.listPlaceholder;
        }
    }

    public getStoredResult(videoId: string): StoredVideoCheckResult {
        if (!localStorage.videosList)
            return null
        const dataFromStorage: (string | { [videoId: string]: StoredVideoCheckResult })[] = JSON.parse(
            localStorage.videosList
        );
        for (let item of dataFromStorage) {
            let id = item.toString();
            let botComments = [];
            let lastCheck = null;
            if (typeof item === 'object') {
                id = Object.keys(item)[0];
                botComments = item[id].comments;
                lastCheck = item[id].lastBotCheck;
            }
            const parsedId = validator.isURL(id) ? queryString.parse(queryString.extract(id)).v : id;
            if (videoId === id || videoId === parsedId) {
                return typeof item === 'object' ? item[id] : null;
            }
        }
        return null;
    }

    public getCheckResults(videoId: string): CheckResults {
        if (!localStorage.videosList) {
            return new CheckResults(videoId, null);
        }
        const dataFromStorage: (string | { [videoId: string]: StoredVideoCheckResult })[] = JSON.parse(
            localStorage.videosList
        );
        for (let item of dataFromStorage) {
            let id = item.toString();
            let botComments = [];
            let lastCheck = null;
            let commentsChecked = 0;
            if (typeof item === 'object') {
                id = Object.keys(item)[0];
                botComments = item[id].comments;
                lastCheck = item[id].lastBotCheck;
                commentsChecked = item[id].commentsChecked;
            }
            const parsedId = validator.isURL(id) ? queryString.parse(queryString.extract(id)).v : id;
            if (videoId === parsedId) {
                return new CheckResults(videoId, lastCheck, botComments, commentsChecked);
            }
        }
        return new CheckResults(videoId, null);
    }

    public clearList() {
        localStorage.removeItem('videosList');
    }

    public loadList() {
        const dataFromStorage: (string | { [videoId: string]: StoredVideoCheckResult })[] = JSON.parse(
            localStorage.videosList
        );
        const videoList = [];
        for (const item of dataFromStorage) {
            let videoId = item;
            if (typeof item === 'object') {
                videoId = Object.keys(item)[0];
                videoList.push(videoId);
            } else if (typeof videoId === 'string') {
                videoList.push(videoId);
            }
        }
        this.videosList = videoList.join('\n');
        this.videosListIsEmpty = false;
    }

    public saveList() {
        // this.suspendWatch();
        localStorage.videosList = JSON.stringify(
            this.videosList
                .split('\n')
                .map(item => ({ [item]: this.getStoredResult(item) || new StoredVideoCheckResult() }))
        );
        // this.resumeWatch();
    }

    public hasVideoInStorage() {
        return (
            localStorage.videosList !== undefined &&
            localStorage.videosList !== null &&
            localStorage.videosList.length > 0
        );
    }
}
