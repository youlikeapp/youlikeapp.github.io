import * as angular from "angular";
import { State, StateProvider, Ng1StateDeclaration } from "angular-ui-router";
import { AboutComponent } from "./about.component";
import { NavService, NavItem } from "./../../common/nav/nav.service";

function routeConfig($stateProvider: StateProvider): void {
    "ngInject";

    $stateProvider
        .state("app.about", {
            url: "/about",
            component: "about"
        });

}
function runConfig(NavService: NavService): void {
    const page: NavItem = {
        state: "app.about",
        url: "/about",
        label: "О проекте",
        icon: "info"
    };
        NavService.addNavItem(page);

}

const About: ng.IModule = angular
    .module("components.about", [
        "720kb.socialshare"
    ])
    .component("about", new AboutComponent)
    .config(routeConfig)
    .run(runConfig);

export default About;