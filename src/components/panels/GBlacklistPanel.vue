<template>
<div v-if="loaded && !disabled">
    <div>
        <input v-model.trim="keyword" type="text" placeholder="user/keyword"></input>
        <button v-on:click="add('user')">Block This User</button>
        <button v-on:click="add('keyword')">Block This Word</button>
    </div>
    <div>
        <h2>Blacklist</h2>
        <p v-for="(type, word) in blacklist">
            {{ word }}
            <span>{{type}}</span>
            <span v-on:click="remove(word)">Remove</span>
        </p>
    </div>
</div>
<div v-else>
    <p>Blacklist Disabled</p>
</div>
</template>

<script>
import storage from '../../core/storage.js';

export default {
    name: 'GBlacklistPanel',
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
</style>
