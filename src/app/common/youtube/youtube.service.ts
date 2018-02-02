import * as queryString from "query-string";
import * as validator from "validator";
import * as toastr from "toastr";
import * as _ from "lodash";

export class YouTubeService {
    private googleAuth: gapi.auth2.GoogleAuth;

    public get isAuthorized(): boolean {
        return this.$rootScope.isAuthorized;
    }

    constructor(private $rootScope: ng.IRootScopeService) {
        "ngInject";

        gapi.load("client:auth2", () => {
            gapi.client.init({
                clientId: "871050293069-eqou5jodn7u9tahldd0jqdhu10mlk13f.apps.googleusercontent.com",
                scope: "https://www.googleapis.com/auth/youtube"
            }).then(() => {
                this.googleAuth = gapi.auth2.getAuthInstance();

                this.googleAuth.isSignedIn.listen(this.updateSignInStatus.bind(this));

                (<any>this.$rootScope).isAuthorized = this.googleAuth.isSignedIn.get();
                (<any>this.$rootScope).currentUser = this.getCurrentUser();

                this.$rootScope.$apply();
            });
        });
    }

    public login(): Promise<void> {
        return this.googleAuth.signIn().then(() => {
            (<any>this.$rootScope).currentUser = this.getCurrentUser();

            this.$rootScope.$apply();
        });
    }

    public logout(): void {
        this.googleAuth.signOut();
    }

    public checkVideos(videosList: string): PromiseLike<CheckingResult> {
        let videos: string[] = videosList.split("\n");
        let videoIds: string[] = videos.map((video) => {
            let result: string;

            if (validator.isURL(video)) {
                result = queryString.parse(queryString.extract(video)).v;
            } else {
                result = video;
            }

            return result;
        });

        // maximum possible batch size for the request is 580.
        let videoIdsChunks: string[][] = _.chunk(videoIds, 580);

        return gapi.client.load("youtube", "v3").then(() => {
            let promises: any[] = [];

            videoIdsChunks.forEach((videoIdsChunk) => {
                let promise: any = (<any>gapi.client).youtube.videos.getRating({
                    id: videoIdsChunk.join(",")
                });

                promises.push(promise);
            });

            return Promise.all(promises);
        })
        .then((responses) => {
            let result: CheckingResult = new CheckingResult();
            let withLikes: string[] = [];
            let withoutLikes: string[] = [];

            for (let i: number = 0; i < (<any>responses).length; i++) {
                const response: any = (<any>responses)[i];
                const items: gapi.client.youtube.VideoRating[] = response.result.items;

                for (let i: number = 0; i < items.length; i++) {
                    const item: gapi.client.youtube.VideoRating = items[i];

                    if (item.rating !== "like") {
                        withoutLikes.push(item.videoId);
                    } else {
                        withLikes.push(item.videoId);
                    }
                }
            }

            result.withLikes = withLikes;
            result.withoutLikes = withoutLikes;

            return result;
        }, (data) => {
            console.error(data);
            toastr.error(`Не удалось проверить список видео.`);

            return null;
        });
    }

    public setRating(videoIds: string[], rating: string, onSuccess?: (videoId: string) => void,
        onError?: (videoId: string, errorMsg: string) => void): PromiseLike<Promise<any[]>> {
        return gapi.client.load("youtube", "v3").then(() => {
            let promises: any[] = [];

            videoIds.forEach((videoId, index) => {
                let promise: any = (<any>gapi.client).youtube.videos.rate({
                    id: videoId,
                    rating: rating
                    }).then(() => {
                        if (onSuccess) {
                            onSuccess(videoId);
                        }
                    }, (data) => {
                        toastr.error(`Не удалось поставить лайк на видео с идентификатором ${ videoId }. ${ data.result.error.message }`);
                        console.error(data);

                        if (onError) {
                            onError(videoId, data.result.error.message);
                        }
                    });

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
}

export class CheckingResult {
    withLikes: string[];
    withoutLikes: string[];
}