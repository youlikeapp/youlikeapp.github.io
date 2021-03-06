import * as angular from "angular";

import Main from "./main";
import About from "./about";
import Extension from "./extension";

const Components: ng.IModule = angular
.module("app.components", [
    Main.name,
    Extension.name,
    About.name
]);

export default Components;