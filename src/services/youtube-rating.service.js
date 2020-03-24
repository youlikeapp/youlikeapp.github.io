const publicApi = {
    checkVideos,
    setRating,
};

const maxSizeOfGapiBatchRequest = 580;
const gapiService = { name: 'youtube', version: 'v3' };

function checkVideos(videoIdList) {
    let videoIds = getUniqueVideoIds(videoIdList);
    let videoIdsChunksMatrix = split(videoIds).intoChunksOf(maxSizeOfGapiBatchRequest);
    return gapi.client
        .load(gapiService.name, gapiService.version)
        .then(() => {
            let promisesArray = [];

            videoIdsChunksMatrix.forEach(videoIdsChunk => {
                let promise = gapi.client.youtube.videos.getRating({
                    id: videoIdsChunk.join(','),
                });

                promises.push(promise);
            });

            return Promise.all(promisesArray);
        })
        .then(
            responses => {
                let result = new CheckingResult();
                let idsWithLikes = [];
                let idsWithoutLikes = [];

                for (let i = 0; i < responses.length; i++) {
                    const response = responses[i];
                    const videoRatingArray = response.result.items;

                    for (let i = 0; i < videoRatingArray.length; i++) {
                        const videoRating = videoRatingArray[i];

                        if (videoRating.rating !== 'like') {
                            idsWithoutLikes.push(videoRating.videoId);
                        } else {
                            idsWithLikes.push(videoRating.videoId);
                        }
                    }
                }

                result.withLikes = withLikes;
                result.withoutLikes = withoutLikes;

                return result;
            },
            data => {
                console.error(data);
                toastr.error(`Не удалось проверить список видео.`);

                return null;
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
                    data => {
                        toastr.error(`Не удалось поставить лайк на видео с идентификатором ${videoId}. ${data.result.error.message}`);
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

function getUniqueVideoIds(videoIdList) {
    const videos = videoIdList.split('\n');
    return _.uniq(
        videos.map(video => {
            let result;

            if (validator.isURL(video)) {
                result = queryString.parse(queryString.extract(video)).v;
            } else {
                result = video;
            }

            return result;
        })
    );
}

function split(arrayToSplit) {
    return { intoChunksOf: chunkSize => _.chunk(arrayToSplit, chunkSize) };
}

const youtubeRatingService = publicApi;
export default youtubeRatingService;
