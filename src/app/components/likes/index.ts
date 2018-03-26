import * as angular from 'angular';
import { State, StateProvider, Ng1StateDeclaration } from 'angular-ui-router';
import { LikesComponent } from './likes';
import { NavService, NavItem } from './../../common/nav/nav.service';
import { VideoListDirective } from '../videolist/videolistDirective';
import { VideoListService } from '../videolist/videoListService';

function routeConfig($stateProvider: StateProvider): void {
    'ngInject';

    $stateProvider.state('app.likes', {
        url: '/',
        component: 'likes'
    });
}
function runConfig(NavService: NavService): void {
    const page: NavItem = {
        state: 'app.likes',
        url: '/',
        label: 'Восстановление',
        icon: 'thumb_up'
    };

    NavService.addNavItem(page);
}

const Likes: ng.IModule = angular
    .module('components.likes', ['blockUI', 'mdCollectionPagination'])
    .service('videoListService', VideoListService)
    .directive('videoList', ['videoListService', () =>  new VideoListDirective()])
    .component('likes', new LikesComponent())
    .config(routeConfig)
    .run(runConfig);

export default Likes;
