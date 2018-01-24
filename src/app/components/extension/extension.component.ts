export class ExtensionComponent implements ng.IComponentOptions {
    controller: ng.IControllerConstructor;
    template: string;

    constructor() {
        this.controller = ExtensionController;
        this.template = require("./extension.html");
    }
}

class ExtensionController implements ng.IComponentController {
    // tslint:disable-next-line:no-empty
    $onInit(): void {}
}