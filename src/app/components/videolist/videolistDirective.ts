import { VideoListService } from './videoListService';
import { IAttributes, IController, IScope, ITranscludeFunction } from 'angular';

export class VideoListDirective implements ng.IDirective {
    public controller: ng.IControllerConstructor;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.controller = VideoListController;
        this.controllerAs = 'videoListCtrl';
        this.template = require('./videoslist.html');
    }
}

class VideoListController implements ng.IComponentController {
    private readonly listPlaceholder: string = 'Пример заполнения:\nhttps://www.youtube.com/watch?v=TadQGyFWPHc\nhttps://www.youtube.com/watch?v=DnQd2wQRoJ0\nqmLJvTiL_Rw';

    constructor(private $scope: ng.IScope, private videoListService: VideoListService) {
        'ngInject';
    }

    public $onInit(): void {
        const startWatch = this.videoListService.startWatch;
        startWatch.call(this.videoListService, this.$scope);
    }

    public onListFocus(): void {
        if (this.videoListService.videosList === this.listPlaceholder) {
            this.videoListService.videosList = null;
        }
    }

    public onListBlur(): void {
        if (!this.videoListService.videosList) {
            this.videoListService.videosList = this.videoListService.listPlaceholder;
            this.videoListService.videosListIsEmpty = true;
        }
    }

    public onListChange(): void {
        if (this.videoListService.videosList) {
            this.videoListService.videosListIsEmpty = false;
        } else {
            this.videoListService.videosListIsEmpty = true;
        }
    }
}
