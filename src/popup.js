import 'chrome-extension-async';
import Vue from 'vue';
import GApp from './components/GApp.vue';

new Vue({
    render: h => h(GApp),
}).$mount('#app');
