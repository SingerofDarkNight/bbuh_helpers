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
    display: flex;
    flex-flow: row;
    list-style-type: none;

    > li {
        width: 25%;
        border-bottom: 1px solid #ccc;
        padding: 3px 5px;
        text-align: center;
        cursor: pointer;
    }

    > li:hover {
        text-decoration: underline;
        color: darkcyan;
    }

    > li.active {
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-bottom: none;
        border-top: 4px solid darkcyan;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
    }
}

.panel {
    padding: 3px 5px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
}
</style>
