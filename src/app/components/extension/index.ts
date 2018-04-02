import * as angular from 'angular';
import { State, StateProvider, Ng1StateDeclaration } from 'angular-ui-router';
import { ExtensionComponent } from './extension.component';
import { NavService, NavItem } from './../../common/nav/nav.service';

function routeConfig($stateProvider: StateProvider): void {
    'ngInject';

    $stateProvider.state('app.extension', {
        url: '/extension',
        component: 'extension'
    });
}
function runConfig(NavService: NavService): void {
    const page: NavItem = {
        state: 'app.extension',
        url: '/extension',
        label: 'Установить расширение',
        icon: 'extension'
    };
    NavService.addNavItem(page);
}

const Extension: ng.IModule = angular
    .module('components.extension', [])
    .component('extension', new ExtensionComponent())
    .config(routeConfig)
    .run(runConfig);

export default Extension;
