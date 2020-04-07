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
    return gapi.client
        .load(gapiService.name, gapiService.version)
        .then(() => {
            let promisesArray = [];

            videoIdsChunksMatrix.forEach((videoIdsChunk) => {
                console.log(videoIdsChunk);
                let promise = gapi.client.youtube.videos.getRating({
                    id: videoIdsChunk.join(','),
                });

                promisesArray.push(promise);
            });

            return Promise.all(promisesArray);
        })
        .then(
            (responses) => {
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
            (data) => {
                console.error('youtube-rating.service.js');
                // toastr.error(`Не удалось проверить список видео.`);

                return data;
            }
        );
}

function setRating(videoIds, rating, onSuccess, onError) {
    return gapi.client.load('youtube', 'v3').then(() => {
        let promisesArray = [];

        videoIds.forEach((videoId, index) => {
            let promise = gapi.client.youtube.videos
                .rate({
                    id: videoId,
                    rating: rating,
                })
                .then(
                    () => {
                        if (onSuccess) {
                            onSuccess(videoId);
                        }
                    },
                    (data) => {
                        // toastr.error(`Не удалось поставить лайк на видео с идентификатором ${videoId}. ${data.result.error.message}`);
                        console.error(data);

                        if (onError) {
                            onError(videoId, data.result.error.message);
                        }
                    }
                );

            promisesArray.push(promise);
        });

        return Promise.all(promisesArray);
    });
}

function extractVideoIds(videos) {
    return videos.map((videoUrl) => (validator.isURL(videoUrl) ? youtubeUrlParserService.getVideoId(videoUrl) : videoUrl));
}

function split(arrayToSplit) {
    return { intoChunksOf: (chunkSize) => _.chunk(arrayToSplit, chunkSize) };
}

const youtubeRatingService = publicApi;
export default youtubeRatingService;
