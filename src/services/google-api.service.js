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
    gapi.load('client:auth2', () => {
        gapi.client
            .init({
                clientId:
                    '871050293069-eqou5jodn7u9tahldd0jqdhu10mlk13f.apps.googleusercontent.com',
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
