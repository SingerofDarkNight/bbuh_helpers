<template>
  <div v-if="loaded && !disabled">
    <div>
      <input
        v-model.trim="keyword"
        type="text"
        placeholder="user/keyword"
      >
      <div class="controlls">
        <GButton
          text="blockUserButton"
          @action="add('user')"
        />
        <GButton
          text="blockWordButton"
          @action="add('keyword')"
        />
      </div>
    </div>
    <div v-if="!isEmpty(blacklist)">
      <h2>{{ _('blacklistHeading') }}</h2>
      <div id="listcontainer">
        <p
          v-for="(type, word) in blacklist"
          :key="word"
          class="listitem"
        >
          <span class="keyword">
            {{ word }}
          </span>
          <span class="type">
            {{ _(type + 'BlacklistType') }}
          </span>
          <span
            class="remove"
            :title="_('deleteTooltip')"
            @click="remove(word)"
          >
            <font-awesome-icon icon="trash-alt" />
          </span>
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    <p class="warning">
      {{ _('labelBlacklistDisabled') }}
    </p>
  </div>
</template>

<script>
import GButton from '../base/GButton.vue';

import storage from '../../core/base/storage.js';
import isEmpty from '../mixins/isEmpty.js';

export default {
    name: 'GBlacklistPanel',
    components: {
        GButton
    },
    mixins: [isEmpty],
    data() {
        return {
            loaded: false,
            disabled: false,
            keyword: '',
            blacklist: {}
        };
    },
    async created() {
        const { blacklist, settings } = await storage.get('blacklist', 'settings');
        for (let word in blacklist) {
            this.blacklist[word] = blacklist[word];
        }
        this.disabled = !settings.enable_blacklist;
        this.loaded = true;
    },
    methods: {
        async add(type) {
            if (this.keyword == '') return;

            let blacklist = await storage.get('blacklist');
            if (blacklist[this.keyword]) {
                blacklist[this.keyword] = 'both';
            } else {
                blacklist[this.keyword] = type;
            }
            await storage.save('blacklist', blacklist);
            // update reactive data
            this.blacklist[this.keyword] = blacklist[this.keyword];
            this.keyword = '';
        },
        async remove(word) {
            let blacklist = await storage.get('blacklist');
            delete blacklist[word];
            await storage.save('blacklist',blacklist);
            this.$delete(this.blacklist, word);
        }
    }
};
</script>

<style lang="scss">
// controlls style are set in GEncodingPanel

.listcontainer {
    padding: 3px 5px;
    display: flex;
    flex-flow: column;
}

.listitem {
    display: flex;
    flex-flow: row;
    width: 100%;
}

.keyword {
    width: 60%;
}

.type {
    width: 30%;
    color: #ccc;
}

.remove {
    width: 10%;
    cursor: pointer;
    text-align: center;
}

.remove:hover {
    color: red;
}

.warning {
    color: red;
}
</style>
