import 'chrome-extension-async';
import Vue from 'vue';
import GApp from './components/GApp.vue';
import i18n from './components/mixins/i18n.js';

Vue.mixin(i18n);

new Vue({
    render: h => h(GApp),
}).$mount('#app');
