import { url } from 'vuelidate/lib/validators';
import youtubeUrlParserService from './youtube-url-parser.service';

function commaSeparatedListOfUrlsOrVideoIds(value) {
    return value.replace(/\s/g, '').split(',').map(toVideoId).every(idIsValid);
}

function toVideoId(youtubeUrl) {
    return url(youtubeUrl) ? youtubeUrlParserService.getVideoId(youtubeUrl) : youtubeUrl;
}

function idIsValid(videoId) {
    return youtubeUrlParserService.isIdValid(videoId);
}

export { commaSeparatedListOfUrlsOrVideoIds };
