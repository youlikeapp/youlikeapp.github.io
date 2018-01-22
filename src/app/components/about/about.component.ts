import "./about.scss";

export class AboutComponent implements ng.IComponentOptions {
    controller: ng.IControllerConstructor;
    template: string;

    constructor() {
        this.controller = AboutController;
        this.template = require("./about.html");
    }
}

class AboutController implements ng.IComponentController {
    // tslint:disable-next-line:no-empty
    $onInit(): void {}

    private readonly socials = [
        {
            provider: "vk",
            icon: "vk",
            title: "ВКонтакте"
        },
        {
            provider: "twitter",
            icon: "twitter",
            title: "Twitter"
        },
        {
            provider: "facebook",
            icon: "facebook",
            title: "Facebook"
        },
        {
            provider: "ok",
            icon: "odnoklassniki",
            title: "Одноклассники"
        },
        {
            provider: "google",
            icon: "google-plus",
            title: "Google+"
        },
        {
            provider: "telegram",
            icon: "telegram",
            title: "Telegram"
        }
    ];
}