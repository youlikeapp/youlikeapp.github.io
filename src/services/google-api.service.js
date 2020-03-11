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

function setUp() {
    return gapi.load('client:auth2', () => {
        gapi.client
            .init({
                clientId:
                    '830004684171-h17li43l6bp0j7nf1ln7slv3v6bdcvl0.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/youtube',
            })
            .then(() => {
                console.log('authenticated');
            });
    });
}

const googleApiService = {
    signIn,
    logOff,
    setUp,
};

export default googleApiService;
