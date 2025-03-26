// plugins/unicons.js
import { defineNuxtPlugin } from "#app";
import Unicon from "vue-unicons";
import {
  uniHeart,
  uniLock,
  uniEnvelope,
  uniGithub,
  uniTwitter,
  uniInstagram,
  uniLinkedin,
  uniDribbble,
  uniArrowRight,
  uniArrowLeft,
  uniAngleDown,
  uniAngleUp,
  uniAngleRight,
  uniAngleLeft,
  uniSearch,
  uniUser,
  uniStar,
  uniCheck,
  uniTimes,
  uniPlus,
  uniMinus,
} from "vue-unicons/dist/icons";

Unicon.add([
  uniHeart,
  uniLock,
  uniEnvelope,
  uniGithub,
  uniTwitter,
  uniInstagram,
  uniLinkedin,
  uniDribbble,
  uniArrowRight,
  uniArrowLeft,
  uniAngleDown,
  uniAngleUp,
  uniAngleRight,
  uniAngleLeft,
  uniSearch,
  uniUser,
  uniStar,
  uniCheck,
  uniTimes,
  uniPlus,
  uniMinus,
]);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Unicon);
});
