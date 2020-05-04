import { uniq } from 'lodash';
import validator from 'validator';
import youtubeUrlParserService from './youtube-url-parser.service';

const publicApi = {
    checkVideos,
    setRating,
};

const maxSizeOfGapiBatchRequest = 580;
const gapiService = { name: 'youtube', version: 'v3' };

function checkVideos(videos) {
    const videoIds = uniq(extractVideoIds(videos));
    const videoIdsChunksMatrix = split(videoIds).intoChunksOf(maxSizeOfGapiBatchRequest);
    return loadGapiClient()
        .then(() => {
            let promisesArray = [];

            videoIdsChunksMatrix.forEach(videoIdsChunk => {
                console.log(videoIdsChunk);
                let promise = gapi.client.youtube.videos.getRating({
                    id: videoIdsChunk.join(','),
                });

                promisesArray.push(promise);
            });

            return Promise.all(promisesArray);
        })
        .then(
            responses => {
                let withLikes = [];
                let withoutLikes = [];

                for (let i = 0; i < responses.length; i++) {
                    const response = responses[i];
                    const videoRatingArray = response.result.items;

                    for (let i = 0; i < videoRatingArray.length; i++) {
                        const videoRating = videoRatingArray[i];

                        if (videoRating.rating !== 'like') {
                            withoutLikes.push(videoRating.videoId);
                        } else {
                            withLikes.push(videoRating.videoId);
                        }
                    }
                }

                return { withLikes, withoutLikes };
            },
            data => {
                console.error('youtube-rating.service.js');
                // toastr.error(`Не удалось проверить список видео.`);

                return data;
            }
        );
}

function setRating(videoIds, rating, onSuccess, onError) {
    return loadGapiClient().then(() => {
        const promisesArray = [];
        const recoveredVideos = { successfull: [], failed: [] };
        videoIds.forEach(videoId => {
            const promise = gapi.client.youtube.videos
                .rate({
                    id: videoId,
                    rating: rating,
                })
                .then(
                    () => {
                        recoveredVideos.successfull.push(videoId);
                    },
                    () => {
                        recoveredVideos.failed.push(videoId);
                    }
                );
            promisesArray.push(promise);
        });
        return Promise.all(promisesArray).then(() => Promise.resolve(recoveredVideos));
    });
}

function loadGapiClient() {
    return gapi.client.load(gapiService.name, gapiService.version);
}

function extractVideoIds(videos) {
    return videos.map(videoUrl => (validator.isURL(videoUrl) ? youtubeUrlParserService.getVideoId(videoUrl) : videoUrl));
}

function split(arrayToSplit) {
    return { intoChunksOf: chunkSize => _.chunk(arrayToSplit, chunkSize) };
}

const youtubeRatingService = publicApi;
export default youtubeRatingService;
