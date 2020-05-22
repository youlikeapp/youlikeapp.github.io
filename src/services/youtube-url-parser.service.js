import queryString from 'query-string';

const publicApi = {
    getVideoId,
    isIdValid,
};

function getVideoId(url) {
    return queryString.parse(queryString.extract(url)).v;
}

function isIdValid(videoId) {
    // https://webapps.stackexchange.com/questions/54443/format-for-id-of-youtube-video
    return /[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/.test(videoId);
}

const youtubeUrlParserService = publicApi;
export default youtubeUrlParserService;
