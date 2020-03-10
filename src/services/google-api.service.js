function signIn() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                name: 'Mateusz Garbaciak',
                image: 'img:statics/photo.png',
            });
        }, 1000);
    });
}

function logOff() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                name: '',
                image: '',
            });
        }, 1000);
    });
}

const googleApiService = {
    signIn,
    logOff,
};

export default googleApiService;
