import * as angular from 'angular';

import Likes from './likes';
import About from './about';
import Extension from './extension';
import CommentsCheck from './comments';

const Components: ng.IModule = angular.module('app.components', [
    Likes.name,
    CommentsCheck.name,
    Extension.name,
    About.name
]);

export default Components;
