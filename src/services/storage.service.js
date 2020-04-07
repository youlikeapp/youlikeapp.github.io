const publicApi = { save, get, remove };

function save(key, value) {
    const valueStringified = JSON.stringify(value);
    localStorage.setItem(key, valueStringified);
    return Promise.resolve(get(key));
}

function get(key) {
    const stringifiedValue = localStorage.getItem(key);
    const obj = JSON.parse(stringifiedValue);
    return Promise.resolve(obj);
}

function remove(key) {
    localStorage.removeItem(key);
    return Promise.resolve(get(key));
}

const storageService = publicApi;
export default storageService;
