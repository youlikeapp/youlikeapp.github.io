import { material } from "angular";

/**
 * App Component
 *
 * @export
 * @class AppComponent
 * @implements {ng.IComponentOptions}
 */
export class AppComponent implements ng.IComponentOptions {
    template: string;
    controller: ng.IControllerConstructor;

    constructor() {
        this.template = require("./app.html");
        this.controller = AppController;
    }
}

/**
 * App Controller
 *
 * @class AppController
 * @implements {ng.IComponentController}
 */
export class AppController implements ng.IComponentController {
    // tslint:disable-next-line:no-empty
    $onInit(): void {}

    constructor(private $mdSidenav: material.ISidenavService) {
        "ngInject";
    }

    public openMenu(): void {
        this.$mdSidenav("left").open();
    }

    public closeMenu(): void {
        this.$mdSidenav("left").close();
    }
}