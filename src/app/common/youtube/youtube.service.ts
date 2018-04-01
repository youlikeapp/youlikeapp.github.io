import * as queryString from 'query-string';
import * as validator from 'validator';
import * as toastr from 'toastr';
import * as _ from 'lodash';
import moment = require('moment');
import { CheckResults, VideoToCheck } from '../../components/comments/commentsCheck';
import VideoListResponse = gapi.client.youtube.VideoListResponse;
import Response = gapi.client.Response;
import Observable = Rx.Observable;
import CommentThreadListResponse = gapi.client.youtube.CommentThreadListResponse;

export class YouTubeService {
    private googleAuth: gapi.auth2.GoogleAuth;
    private loggedUserChannelId: string;
    public loggedUserOwnVideos: string[] = [];
    private dbUrl = 'https://raw.githubusercontent.com/YTObserver/YT-ACC-DB/master/mainDB';
    private botData: string[];
    private totalCommentsChecked = 0;
    private totalCommentsToCheck = 0;
    private botsFound = 0;

    public get isAuthorized(): boolean {
        return this.$rootScope.isAuthorized;
    }

    constructor(private $rootScope: ng.IRootScopeServicex, private blockUI: blockUI.BlockUIService) {
        'ngInject';

        gapi.load('client:auth2', () => {
            gapi.client
                .init({
                    clientId: '871050293069-eqou5jodn7u9tahldd0jqdhu10mlk13f.apps.googleusercontent.com',
                    scope: 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl'
                })
                .then(() => {
                    this.googleAuth = gapi.auth2.getAuthInstance();

                    this.googleAuth.isSignedIn.listen(this.updateSignInStatus.bind(this));

                    (<any>this.$rootScope).isAuthorized = this.googleAuth.isSignedIn.get();
                    (<any>this.$rootScope).currentUser = this.getCurrentUser();

                    this.$rootScope.$apply();
                })
                .catch(onRejected => console.log('error gapi client init', onRejected));
        });
    }

    public login(): Promise<void> {
        return this.googleAuth.signIn().then(() => {
            (<any>this.$rootScope).currentUser = this.getCurrentUser();

            this.$rootScope.$apply();
        });
    }

    public logout(): void {
        this.loggedUserChannelId = undefined;
        this.loggedUserOwnVideos = [];
        this.googleAuth.signOut();
    }

    public showComents(videosList: string) {
        let videos: string[] = videosList.split('\n');
        let videoIds: string[] = _.uniq(
            videos.map(video => {
                let result: string;

                if (validator.isURL(video)) {
                    result = queryString.parse(queryString.extract(video)).v;
                } else {
                    result = video;
                }

                return result;
            })
        );
        let video1 = videoIds[0];

        return gapi.client.load('youtube', 'v3').then(() => {
            return this.getCurrentUser().getId();
        });
    }

    public checkVideos(videosList: string): PromiseLike<CheckingResult> {
        let videos: string[] = videosList.split('\n');
        let videoIds: string[] = _.uniq(
            videos.map(video => {
                let result: string;

                if (validator.isURL(video)) {
                    result = queryString.parse(queryString.extract(video)).v;
                } else {
                    result = video;
                }

                return result;
            })
        );

        // maximum possible batch size for the request is 580.
        let videoIdsChunks: string[][] = _.chunk(videoIds, 580);

        return gapi.client
            .load('youtube', 'v3')
            .then(() => {
                let promises: any[] = [];

                videoIdsChunks.forEach(videoIdsChunk => {
                    let promise: any = (<any>gapi.client).youtube.videos.getRating({
                        id: videoIdsChunk.join(',')
                    });

                    promises.push(promise);
                });

                return Promise.all(promises);
            })
            .then(
                responses => {
                    let result: CheckingResult = new CheckingResult();
                    let withLikes: string[] = [];
                    let withoutLikes: string[] = [];

                    for (let i: number = 0; i < (<any>responses).length; i++) {
                        const response: any = (<any>responses)[i];
                        const items: gapi.client.youtube.VideoRating[] = response.result.items;

                        for (let j: number = 0; j < items.length; j++) {
                            const item: gapi.client.youtube.VideoRating = items[j];

                            if (item.rating !== 'like') {
                                withoutLikes.push(item.videoId);
                            } else {
                                withLikes.push(item.videoId);
                            }
                        }
                    }

                    result.withLikes = withLikes;
                    result.withoutLikes = withoutLikes;

                    return result;
                },
                data => {
                    console.error(data);
                    toastr.error(`Не удалось проверить список видео.`);

                    return null;
                }
            );
    }

    public setRating(
        videoIds: string[],
        rating: string,
        onSuccess?: (videoId: string) => void,
        onError?: (videoId: string, errorMsg: string) => void
    ): PromiseLike<Promise<any[]>> {
        return gapi.client.load('youtube', 'v3').then(() => {
            let promises: any[] = [];

            videoIds.forEach((videoId, index) => {
                let promise: any = (<any>gapi.client).youtube.videos
                    .rate({
                        id: videoId,
                        rating: rating
                    })
                    .then(
                        () => {
                            if (onSuccess) {
                                onSuccess(videoId);
                            }
                        },
                        data => {
                            toastr.error(
                                `Не удалось поставить лайк на видео с идентификатором ${videoId}. ${
                                    data.result.error.message
                                }`
                            );
                            console.error(data);

                            if (onError) {
                                onError(videoId, data.result.error.message);
                            }
                        }
                    );

                promises.push(promise);
            });

            return Promise.all(promises);
        });
    }

    private updateSignInStatus(isSignedIn: boolean): void {
        (<any>this.$rootScope).isAuthorized = isSignedIn;

        this.$rootScope.$apply();
    }

    private getCurrentUser(): gapi.auth2.BasicProfile {
        return this.googleAuth.currentUser.get().getBasicProfile();
    }

    private async getMyChannel(onSuccess?: () => void) {
        await gapi.client.load('youtube', 'v3');

        try {
            const response = await (<any>gapi.client).youtube.channels.list({
                mine: true,
                part: 'snippet,contentDetails,statistics'
            });

            const channels: gapi.client.youtube.Channel[] = response.result.items;
            const uploadPlaylistId = channels[0].contentDetails.relatedPlaylists.uploads;
            this.loggedUserChannelId = channels[0].id;

            const playListItemsResponse = await (<any>gapi.client).youtube.playlistItems.list({
                playlistId: uploadPlaylistId,
                part: 'contentDetails',
                maxResults: 50
            });
            const items: gapi.client.youtube.PlaylistItem[] = playListItemsResponse.result.items;
            this.loggedUserOwnVideos = items.map(item => item.contentDetails.videoId);
            if (onSuccess) {
                return onSuccess();
            }
        } catch (error) {
            throw new Error(`Ошибка получения списка собственных видео для авторизованного пользователя`);
        }
    }

    private getMostFreshCommentDate(commentThread: gapi.client.youtube.CommentThread[]) {
        const firstComment = commentThread[0].snippet.topLevelComment;
        // check for pinned comment
        if (firstComment.snippet.authorChannelId !== this.loggedUserChannelId || commentThread.length === 1) {
            return new Date(firstComment.snippet.publishedAt);
        } else {
            return new Date(commentThread[1].snippet.topLevelComment.snippet.publishedAt);
        }
    }

    public async parseCommentListResponse(
        commentResponse: gapi.client.youtube.CommentThreadListResponse,
        videoCommentCheckResult: YoutubeCommentsCheckResult,
        fullRecheck?: boolean
    ): Promise<YoutubeCommentsCheckResult> {
        const items: gapi.client.youtube.CommentThread[] = commentResponse.items;
        if (items.length === 0) {
            return videoCommentCheckResult;
        }

        if (!videoCommentCheckResult.mostFreshCommentChecked)
            videoCommentCheckResult.mostFreshCommentChecked = this.getMostFreshCommentDate(items);

        const latestCheckResult = moment(videoCommentCheckResult.lastCheckLatestCommentChecked);
        for (const item of items) {
            const comment = item.snippet.topLevelComment;
            const authorId = comment.snippet.authorChannelId.value;
            if (!fullRecheck && moment(comment.snippet.publishedAt).isSameOrBefore(latestCheckResult)) {
                // console.log(
                //     `stopping check because comment publishedAt=${
                //         comment.snippet.publishedAt
                //     } is same or before latestCheckResult = ${latestCheckResult.toDate()}`
                // );
                videoCommentCheckResult.abortNextPageFetch = true;
                return videoCommentCheckResult;
            }
            if (!this.botData) {
                await this.fetchBotData();
            }
            if (this.isBot(authorId)) {
                videoCommentCheckResult.botComments.push({
                    id: comment.id,
                    text: comment.snippet.textDisplay,
                    published: comment.snippet.publishedAt,
                    authorName: comment.snippet.authorDisplayName,
                    authorId,
                    topLevel: true
                });
                this.botsFound++;
            }
            this.totalCommentsChecked++;
            const replies = (item.replies && item.replies.comments) || [];
            replies.forEach(reply => {
                const replyAuthorId = reply.snippet.authorChannelId.value;
                if (this.isBot(replyAuthorId)) {
                    videoCommentCheckResult.botComments.push({
                        id: reply.id,
                        text: reply.snippet.textDisplay,
                        published: reply.snippet.publishedAt,
                        authorName: comment.snippet.authorDisplayName,
                        authorId: replyAuthorId,
                        topLevel: false
                    });
                    this.botsFound++;
                }
                this.totalCommentsChecked++;
            });
            this.blockUI.message({
                totalCommentsChecked: this.totalCommentsChecked,
                totalCommentsToCheck: this.totalCommentsToCheck,
                botComments: this.botsFound
            });
            this.$rootScope.$apply();
        }
        return videoCommentCheckResult;
    }

    private commentThreadRequest(
        requestParams,
        videoCommentCheckResult: YoutubeCommentsCheckResult,
        nextPageToken?: string,
        fullRecheck?: boolean
    ): Observable<YoutubeCommentsCheckResult> {
        if (nextPageToken) {
            requestParams = { ...requestParams, ...{ pageToken: nextPageToken } };
        }
        // try {
        const commentThreadList$: Observable<Response<CommentThreadListResponse>> = Observable.fromPromise(
            (<any>gapi.client).youtube.commentThreads.list(requestParams)
        );
        return commentThreadList$
            .switchMap(
                response1 =>
                    Observable.fromPromise(this.parseCommentListResponse(response1.result, videoCommentCheckResult)),
                (response1, response2) => ({ response1, response2 })
            )
            .switchMap(
                (merged: { response1: Response<CommentThreadListResponse>; response2: YoutubeCommentsCheckResult }) => {
                    const { response1, response2 } = merged;
                    videoCommentCheckResult = response2;
                    if (response1.result.nextPageToken && !videoCommentCheckResult.abortNextPageFetch) {
                        return this.commentThreadRequest(
                            requestParams,
                            videoCommentCheckResult,
                            response1.result.nextPageToken,
                            fullRecheck
                        );
                    } else {
                        return Observable.of(videoCommentCheckResult);
                    }
                }
            );
        // } catch (error) {
        //     videoCommentCheckResult.mostFreshCommentChecked = videoCommentCheckResult.lastCheckLatestCommentChecked;
        //     videoCommentCheckResult.error = true;
        //     console.log(
        //         'error making commentThreadRequest, resetting mostFreshCommentChecked to previous check value',
        //         error
        //     );
        // }
        // return videoCommentCheckResult;
    }

    public async commentsCheck(
        videosToCheck: VideoToCheck[],
        fullRecheck?: boolean
    ): Promise<Observable<YoutubeCommentsCheckResult[]>> {
        this.botsFound = 0;
        this.totalCommentsChecked = 0;
        this.totalCommentsToCheck = 0;
        await gapi.client.load('youtube', 'v3');

        if (!this.loggedUserChannelId) {
            await this.getMyChannel();
        }
        let result: YoutubeCommentsCheckResult[] = [];
        try {
            const allVideoIds = videosToCheck.map(item => item.videoId).join(',');
            const response: Response<VideoListResponse> = await (<any>gapi.client).youtube.videos.list({
                id: allVideoIds,
                part: 'snippet, statistics'
            });
            console.log(response);
            const youtubeCheckResults = response.result.items.map(item => {
                const videoToCheck = videosToCheck.find(v => v.videoId === item.id);
                const videoCommentCheckResult = new YoutubeCommentsCheckResult(
                    videoToCheck.videoId,
                    videoToCheck.lastCheck
                );
                videoCommentCheckResult.title = item.snippet.title;
                videoCommentCheckResult.channelName = item.snippet.channelTitle;
                const commentsForCheck =
                    Number(item.statistics.commentCount) - ((videoToCheck && videoToCheck.totalCommentsChecked) || 0);
                videoCommentCheckResult.commentsForCheck = commentsForCheck;
                this.totalCommentsToCheck += commentsForCheck;
                return videoCommentCheckResult;
            });

            const observables$ = [];
            for (const youtubeCheckResult of youtubeCheckResults) {
                const requestParams = { videoId: youtubeCheckResult.videoId, part: 'snippet,replies', maxResults: 100 };
                observables$.push(
                    this.commentThreadRequest(requestParams, youtubeCheckResult, null, fullRecheck).map(v => {
                        console.log('commentThreadRequest v = ', v);
                        return v;
                    })
                );
            }
            return Observable.combineLatest(observables$);
        } catch (error) {
            toastr.error(error);
            console.error('youtubeservice error', error);
            return Observable.from([]);
        }
    }
    private async fetchBotData() {
        try {
            const dbResponseStream = await fetch(this.dbUrl /*, { headers: myHeaders }*/);
            const reader = dbResponseStream.body.getReader();
            const botsArr = [];
            await new Promise((resolve, reject) => {
                // @ts-ignore
                const stream = new ReadableStream({
                    start(controller) {
                        function push() {
                            // "done" is a Boolean and value a "Uint8Array"
                            reader.read().then(({ done, value }) => {
                                // Is there no more data to read?
                                if (done) {
                                    // Tell the browser that we have finished sending data
                                    controller.close();
                                    resolve(botsArr);
                                    return;
                                }

                                // Get the data and send it to the browser via the controller
                                controller.enqueue(value);
                                const str = String.fromCharCode.apply(null, value);
                                const valueArr = str.split(/=.*\r\n?/);
                                botsArr.push(...valueArr);
                                push();
                            });
                        }

                        push();
                    }
                });
            });
            this.botData = botsArr;
        } catch (error) {
            throw new Error('error fetching bot db');
        }
    }

    private isBot(authorId: string): boolean {
        return authorId === 'UCyzxziMPZSZoHELLc0LABfg' || (this.botData && this.botData.indexOf(authorId) !== -1);
    }

    public isVideoOwner(videoId): boolean {
        return this.loggedUserOwnVideos.indexOf(videoId) >= 0;
    }

    public async banBotComments(checkResults: CheckResults[]): Promise<CheckResults[]> {
        if (!this.loggedUserOwnVideos.length) {
            await this.getMyChannel();
        }

        const videosForBan = checkResults.filter(item => this.loggedUserOwnVideos.indexOf(item.videoId) > 0);
        if (videosForBan.length === 0) {
            toastr.error(
                'Вы не являетесь владельцем ниодного из отмеченых видео с ботами, попробуйте зайти под владельцем канала'
            );
            return [];
        }

        let banIds = [];
        videosForBan.map(item => {
            banIds.push(...item.botComments.map(comment => comment.id));
        });

        try {
            await (<any>gapi.client).youtube.comments.setModerationStatus({
                id: banIds.join(','),
                moderationStatus: 'rejected',
                banAuthor: true
            });
        } catch (error) {
            throw new Error('Ошибка выполнения запроса на бан');
        }

        return videosForBan;
    }
}

export class CheckingResult {
    public withLikes: string[] = [];
    public withoutLikes: string[] = [];
}

export type BotComment = {
    id: string;
    text: string;
    published: string;
    authorName: string;
    authorId: string;
    topLevel: boolean;
};

export class YoutubeCommentsCheckResult {
    public videoId: string;

    public botComments: BotComment[] = [];
    /**
     * Comments in response come sorted by date in descending order. This property is set when we process first comment.
     */
    public mostFreshCommentChecked: Date;
    /**
     * This is fallback date we reset mostFreshCommentChecked to if error occurs
     */
    public lastCheckLatestCommentChecked: Date;
    /**
     * Number of comments checked for video during this check. Is saved in localstorage afterwards.
     * @type {number}
     */
    public commentsForCheck = 0;
    public abortNextPageFetch = false;
    public error: boolean = false;
    public channelName: string;
    public title: string;

    public getLatestCommentDate(): string {
        return this.mostFreshCommentChecked ? this.mostFreshCommentChecked.toLocaleString() : '-';
    }

    constructor(videoId: string, lastCheckLatestCommentChecked: Date) {
        this.lastCheckLatestCommentChecked = lastCheckLatestCommentChecked;
        this.videoId = videoId;
    }
}
