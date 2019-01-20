<template>
<div v-if="loaded">
    <h2>Options</h2>
    <p>Know What You Do and Change It.</p>
    <section>
        <h3>User Levels</h3>
        <p>You should not modify this most of the time.</p>
        <p>The input only accept a list of numbers seperated by commas.</p>
        <input type="text" v-model.trim="userlevels">
        <button type="button" v-on:click="saveUserLevels">Save</button>
    </section>
    <section>
        <h3>Main Post Label</h3>
        <p>The main post label is used to block user replies by levels</p>
        <input type="text" v-model.trim="main_post_label">
        <button type="button" v-on:click="saveMainPostLabel">Save</button>
    </section>
    <section>
        <h3>Useful Switches</h3>
        <p>
            <input type="checkbox"
                   name="enable_auto_sign"
                   v-model="enable_auto_sign"
                   v-on:change="toggle('enable_auto_sign')">
            <label for="enable_auto_sign">Enable Auto Sign</label>
        </p>
        <p>
            <input type="checkbox"
                   name="enable_farm_kit"
                   v-model="enable_farm_kit"
                   v-on:change="toggle('enable_farm_kit')">
            <label for="enable_farm_kit">Enable Farm Kit</label>
        </p>
        <p>
            <input type="checkbox"
                   name="enable_blacklist"
                   v-model="enable_blacklist"
                   v-on:change="toggle('enable_blacklist')">
            <label for="enable_blacklist">Enable Blacklist</label>
        </p>
    </section>
</div>
<div v-else>
    <p>loading</p>;
</div>
</template>

<script>
import storage from '../../core/storage.js';

export default {
    name: 'GOptionsPanel',
    data() {
        return {
            loaded: false,
            userlevels: '',
            main_post_label: '',
            enable_auto_sign: true,
            enable_farm_kit: true,
            enable_blacklist: true
        };
    },
    async created() {
        const { misc, settings } = await storage.get('misc', 'settings');

        this.userlevels = misc.user_levels.toString();
        for (let k in settings) {
            this[k] = settings[k];
        }
        this.loaded = true;
    },
    methods: {
        async saveUserLevels() {
            let misc = await storage.get('misc');
            let data = this.userlevels.split(',');

            let a = [];
            for (let i of data) {
                let num = Number.parseInt(i);
                if (Number.isNaN(num)) {
                    this.userlevels = misc.user_levels.toString();
                    return;
                }
                a.push(num);
            }
            misc.user_levels = a;
            await storage.save('misc', misc);
        },
        async saveMainPostLabel() {
            let settings = await storage.get('settings');
            settings.main_post_label = this.main_post_label;
            await storage.save('settings', settings);
        },
        async toggle(sw) {
            let settings = await storage.get('settings');
            settings[sw] = !settings[sw];
            await storage.save('settings', settings);
        }
    }
};
</script>

<style lang="scss">
</style>
