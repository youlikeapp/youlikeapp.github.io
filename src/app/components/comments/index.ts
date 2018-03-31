import * as angular from 'angular';
import { StateProvider } from 'angular-ui-router';
import { CommentsCheckComponent } from './commentsCheck';
import { NavService, NavItem } from './../../common/nav/nav.service';
import { VideoListService } from '../videolist/videoListService';
import { VideoListDirective } from '../videolist/videolistDirective';

function routeConfig($stateProvider: StateProvider): void {
    'ngInject';

    $stateProvider.state('app.commentsCheck', {
        url: '/comments_check',
        component: 'commentsCheck'
    });
}
function runConfig(NavService: NavService): void {
    const page: NavItem = {
        state: 'app.commentsCheck',
        url: '/comments_check   ',
        label: 'Кремлеботы',
        icon: 'android'
    };

    NavService.addNavItem(page);
}

const CommentsCheck: ng.IModule = angular
    .module('components.commentsCheck', ['blockUI', 'mdCollectionPagination', 'rx'])
    .service('videoListService', VideoListService)
    .component('commentsCheck', new CommentsCheckComponent())
    .directive('videoListComments', ['videoListService', () => new VideoListDirective()])
    .config(routeConfig)
    .config([
        'blockUIConfig',
        blockUIConfig => {
            blockUIConfig.templateUrl = 'blockTemplate.html';
        }
    ])
    .run(runConfig);

export default CommentsCheck;
