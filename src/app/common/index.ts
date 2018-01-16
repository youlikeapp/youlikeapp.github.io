import * as angular from "angular";
import Nav from "./nav";
import YouTube from "./youtube";

const Common: ng.IModule = angular
    .module("app.common", [
        Nav.name,
        YouTube.name
    ]);

export default Common;