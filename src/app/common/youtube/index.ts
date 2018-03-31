import { StateProvider } from 'angular-ui-router';
import * as angular from 'angular';
import * as toastr from 'toastr';
import * as moment from 'moment';
import { Md5 } from 'ts-md5';
import YouTubeAccountComponent from './account.component';
import { YouTubeService } from './youtube.service';

const YouTube: ng.IModule = angular
    .module('common.youtube', ['rx'])
    .config(($stateProvider: StateProvider) => {
        'ngInject';
    })
    .config(($provide: angular.auto.IProvideService) => {
        $provide.decorator('youtubeService', ($delegate: YouTubeService) => {
            // tslint:disable-next-line:typedef
            let youtubeWrapper = (originalFn: Function, cooldownTimeInSeconds?: number) => {
                // tslint:disable-next-line:typedef
                return function() {
                    const dateFormat: string = 'DD.MM.YYYY HH:mm:ss';

                    let hash: string = <string>Md5.hashStr(originalFn.toString());

                    if (cooldownTimeInSeconds) {
                        let data: string = localStorage.getItem(hash);

                        if (data) {
                            let momentOfAvailability: moment.Moment = moment(data, dateFormat).add(
                                cooldownTimeInSeconds,
                                'second'
                            );
                            let currentMoment: moment.Moment = moment();

                            if (currentMoment.isBefore(momentOfAvailability)) {
                                // tslint:disable-next-line:max-line-length
                                let errorMsg: string = `Данное действие временно недоступно. Его можно будет выполнить после ${momentOfAvailability.format(
                                    dateFormat
                                )}`;
                                toastr.error(errorMsg);

                                throw new Error(errorMsg);
                            }
                        }
                    }

                    let args: any[] = [];

                    // tslint:disable-next-line:typedef
                    for (let i = 0; i < arguments.length; i++) {
                        args[i] = arguments[i];
                    }

                    if ($delegate.isAuthorized) {
                        localStorage.setItem(hash, moment().format(dateFormat));

                        return originalFn.apply($delegate, args);
                    } else {
                        // tslint:disable-next-line:typedef
                        return $delegate
                            .login()
                            .then(() => {
                                localStorage.setItem(hash, moment().format(dateFormat));

                                return originalFn.apply($delegate, args);
                            })
                            .catch(data => {
                                if (data.error === 'popup_closed_by_user') {
                                    toastr.error('Не удалось выполнить действие, т.к. Вы не авторизованы.');
                                    console.error(data);
                                }
                            });
                    }
                };
            };

            $delegate.checkVideos = youtubeWrapper($delegate.checkVideos, 1);
            $delegate.setRating = youtubeWrapper($delegate.setRating, 60 * 60 * 6);
            $delegate.commentsCheck = youtubeWrapper($delegate.commentsCheck, 10);
            $delegate.banBotComments = youtubeWrapper($delegate.banBotComments, 1);

            return $delegate;
        });
    })
    .service('youtubeService', YouTubeService)
    .component('youtubeAccount', new YouTubeAccountComponent());

export default YouTube;
