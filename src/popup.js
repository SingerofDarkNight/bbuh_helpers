import 'chrome-extension-async';
import Vue from 'vue';
import GApp from './components/GApp.vue';
import i18n from './components/mixins/i18n.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faAngleDoubleDown,
    faAngleDoubleUp,
    faCogs,
    faEraser,
    faExchangeAlt,
    faPlus,
    faTrashAlt,
    faWindowClose
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
    faAngleDoubleDown,
    faAngleDoubleUp,
    faCogs,
    faEraser,
    faExchangeAlt,
    faPlus,
    faTrashAlt,
    faWindowClose
);

Vue.mixin(i18n);
Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
    render: h => h(GApp),
}).$mount('#app');
