import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Icons
import { faVk } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faOdnoklassniki } from "@fortawesome/free-brands-svg-icons";
import { faGooglePlus } from "@fortawesome/free-brands-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faChrome } from "@fortawesome/free-brands-svg-icons";
import { faFirefox } from "@fortawesome/free-brands-svg-icons";
import { faOpera } from "@fortawesome/free-brands-svg-icons";

export default ({ Vue }) => {
  library.add(
    faVk,
    faTwitter,
    faFacebook,
    faOdnoklassniki,
    faGooglePlus,
    faTelegram,
    faChrome,
    faOpera,
    faFirefox
  );
  Vue.component("fa", FontAwesomeIcon);
};
