import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';

// Add both icons to the library
library.add(faMicrophone, faMicrophoneSlash);

export { FontAwesomeIcon };
