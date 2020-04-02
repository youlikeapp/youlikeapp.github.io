const publicApi = { save, get };

function save(key, value) {
    const valueStringified = JSON.stringify(value);
    localStorage.setItem(key, valueStringified);
    return Promise.resolve(value);
}

function get(key) {
    const stringifiedValue = localStorage.getItem(key);
    const obj = JSON.parse(stringifiedValue);
    return Promise.resolve(obj);
}

const storageService = publicApi;
export default storageService;
