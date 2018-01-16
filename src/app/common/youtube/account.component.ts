import { YouTubeService } from "./youtube.service";

export default class YouTubeAccountComponent implements ng.IComponentOptions {
    controller: ng.IControllerConstructor;
    template: string;

    constructor() {
        this.controller = YouTubeAccountController;
        this.template = require("./account.html");
    }
}

class YouTubeAccountController implements ng.IComponentController {
    public get isAuthorized(): boolean {
        return this.$rootScope.isAuthorized;
    }

    public get username(): string {
        return (<gapi.auth2.BasicProfile>this.$rootScope.currentUser).getName();
    }

    public get imageUrl(): string {
        return (<gapi.auth2.BasicProfile>this.$rootScope.currentUser).getImageUrl();
    }

    constructor(private $rootScope: ng.IRootScopeService,
        private youtubeService: YouTubeService) {
        "ngInject";
    }

    // tslint:disable-next-line:no-empty
    $onInit(): void {

    }

    public login(): void {
        this.youtubeService.login();
    }

    public logout(): void {
        this.youtubeService.logout();
    }
}