import * as angular from "angular";

import Main from "./main";
import About from "./about";

const Components: ng.IModule = angular
.module("app.components", [
    Main.name,
    About.name
]);

export default Components;