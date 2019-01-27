<template>
  <main
    v-if="loaded"
    role="main"
  >
    <ul class="tabs">
      <li
        v-for="tab in tabs"
        :key="tab"
        :class="[{active: currentTab == tab}]"
        @click="changeTab(tab)"
      >
        {{ _('label' + tab) }}
      </li>
    </ul>
    <keep-alive>
      <component
        :is="currentTabComponent"
        class="panel"
      />
    </keep-alive>
  </main>
</template>

<script>
import storage from '../../core/base/storage.js';

import GBlacklistPanel from '../panels/GBlacklistPanel.vue';
import GEncodingPanel from '../panels/GEncodingPanel.vue';
import GMiscPanel from '../panels/GMiscPanel.vue';
import GProfilesPanel from '../panels/GProfilesPanel.vue';

export default {
    name: 'GTabsPage',
    components: {
        GBlacklistPanel,
        GEncodingPanel,
        GMiscPanel,
        GProfilesPanel
    },
    data() {
        return {
            loaded: false,
            currentTab: '',
            tabs: ['Profiles', 'Blacklist', 'Encoding', 'Misc']
        };
    },
    computed: {
        currentTabComponent() {
            return `G${this.currentTab}Panel`;
        },
    },
    async created() {
        const meta = await storage.get('meta');
        this.currentTab = meta.last_opened_tab;
        this.loaded = true;
    },
    methods: {
        async changeTab(tab) {
            this.currentTab = tab;
            const meta = await storage.get('meta');
            meta.last_opened_tab = tab;
            await storage.save('meta', meta);
        }
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
