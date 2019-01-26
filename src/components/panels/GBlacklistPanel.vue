<template>
<div v-if="loaded && !disabled">
    <div>
        <input v-model.trim="keyword" type="text" placeholder="user/keyword"></input>
        <div class="controlls">
            <button v-on:click="add('user')">{{ _('blockUserButton') }}</button>
            <button v-on:click="add('keyword')">{{ _('blockWordButton') }}</button>
        </div>
    </div>
    <div v-if="!isEmpty(blacklist)">
        <h2>{{ _('blacklistHeading') }}</h2>
        <div id="listcontainer">
            <p class="listitem" v-for="(type, word) in blacklist">
                <span class="keyword">{{ word }}</span>
                <span class="type">{{ _(type + 'BlacklistType') }}</span>
                <span class="remove"
                      v-on:click="remove(word)"
                      v-bind:title="_('deleteTooltip')">
                    <font-awesome-icon icon="trash-alt"></font-awesome-icon>
                </span>
            </p>
        </div>
    </div>
</div>
<div v-else>
    <p class="warning">{{ _('labelBlacklistDisabled') }}</p>
</div>
</template>

<script>
import storage from '../../core/base/storage.js';
import isEmpty from '../mixins/isEmpty.js';

export default {
    name: 'GBlacklistPanel',
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
    text-decoration: underline;
    color: red;
}

.warning {
    color: red;
}
</style>
