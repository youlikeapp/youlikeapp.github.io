import * as angular from "angular";
import { State, StateProvider, Ng1StateDeclaration } from "angular-ui-router";
import { MainComponent } from "./main.component";
import { NavService, NavItem } from "./../../common/nav/nav.service";

function routeConfig($stateProvider: StateProvider): void {
    "ngInject";


    $stateProvider
        .state("app.main", {
            url: "/",
            component: "main"
        });

}
function runConfig(NavService: NavService): void {
    const page: NavItem = {
        state: "app.main",
        url: "/",
        label: "Восстановление",
        icon: "thumb_up"
    };

    NavService.addNavItem(page);
}

const Main: ng.IModule = angular
    .module("components.main", [
        "blockUI"
    ])
    .component("main", new MainComponent)
    .config(routeConfig)
    .run(runConfig);

export default Main;