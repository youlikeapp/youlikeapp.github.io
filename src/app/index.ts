import * as angular from "angular";
import { UrlRouterProvider, StateProvider } from "angular-ui-router";
import * as toastr from "toastr";
import { AppComponent } from "./app.component";
import Common from "./common";
import Components from "./components";

import "./app.scss";


// tslint:disable-next-line:typedef
function routeConfig(
    $locationProvider: ng.ILocationProvider,
    $urlRouterProvider: UrlRouterProvider,
    $stateProvider: StateProvider
) {
    "ngInject";

    $stateProvider
        .state("app", {
            redirectTo: "app.main",
            abstract: true,
            component: "app"
        });

    $urlRouterProvider.otherwise("/");
}

// tslint:disable-next-line:typedef
function themeConfig($mdThemingProvider: ng.material.IThemingProvider) {
    "ngInject";

    $mdThemingProvider.theme("default")
        .primaryPalette("blue")
        .accentPalette("red");
}

// tslint:disable-next-line:typedef
function toastrConfig() {
    toastr.options.positionClass = "toast-bottom-right";
    toastr.options.closeButton = true;
}

const App: ng.IModule = angular
    .module("app", [
        "ui.router",
        "ngMessages",
        "ngMaterial",
        "ngAria",
        "ngAnimate",
        Common.name,
        Components.name
    ])
    .config(routeConfig)
    .config(themeConfig)
    .config(toastrConfig)
    .component("app", new AppComponent);

export default App;