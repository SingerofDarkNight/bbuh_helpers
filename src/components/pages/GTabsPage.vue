<template>
<main role="main">
    <ul class="tabs">
        <li
            v-for="tab in tabs"
            v-bind:key="tab"
            v-bind:class="[{active: currentTab == tab}]"
            v-on:click="currentTab = tab"
        >{{tab}}</li>
    </ul>
    <keep-alive>
        <component v-bind:is="currentTabComponent" class="panel"></component>
    </keep-alive>
</main>
</template>

<script>
import GBlacklistPanel from '../panels/GBlacklistPanel.vue';
import GEncodingPanel from '../panels/GEncodingPanel.vue';
import GMiscPanel from '../panels/GMiscPanel.vue';
import GProfilesPanel from '../panels/GProfilesPanel.vue';

export default {
    name: 'GTabsPage',
    data() {
        return {
            currentTab: 'Profiles',
            tabs: ['Profiles', 'Blacklist', 'Encoding', 'Misc']
        }
    },
    computed: {
        currentTabComponent() {
            return `G${this.currentTab}Panel`;
        }
    },
    components: {
        GBlacklistPanel,
        GEncodingPanel,
        GMiscPanel,
        GProfilesPanel
    }
};
</script>

<style lang="scss">
ul.tabs {
    list-style-type: none;
}

ul.tabs > li {
    display: inline;
    padding: 1px 3px;
}
</style>
