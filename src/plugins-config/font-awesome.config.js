import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';

// Icons
import { faVk } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faOdnoklassniki } from '@fortawesome/free-brands-svg-icons';
import { faGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function setUpFontAwesome() {
    library.add(
        faVk,
        faTwitter,
        faFacebook,
        faOdnoklassniki,
        faGooglePlus,
        faTelegram
    );
    Vue.component('font-awesome-icon', FontAwesomeIcon);
}
