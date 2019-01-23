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
        <button type="button" v-on:click="saveText('main_post_label')">Save</button>
    </section>
    <section>
        <h3>Emotions</h3>
        <p>The emotion string is used by auto sign.</p>
        <input type="text" v-model.trim="todaysay">
        <button type="button" v-on:click="saveText('todaysay')">Save</button>
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
    <section>
        <h3>Import/Export</h3>
        <div class="controlls">
            <label class="btn">Import<input type="file" accept=".json" v-on:change="importData">
            </label>
            <button type="button" v-on:click="exportData">Export</button>
        </div>
    </section>
</div>
<div v-else>
    <p>loading</p>;
</div>
</template>

<script>
import storage from '../../core/base/storage.js';

export default {
    name: 'GOptionsPanel',
    data() {
        return {
            loaded: false,
            userlevels: '',
            main_post_label: '',
            todaysay: '',
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
        async saveText(k) {
            let settings = await storage.get('settings');
            settings[k] = this[k];
            await storage.save('settings', settings);
        },
        async toggle(sw) {
            let settings = await storage.get('settings');
            settings[sw] = !settings[sw];
            await storage.save('settings', settings);
        },
        async exportData() {
            const items = await storage.getAll();
            const data = JSON.stringify(items, null, 4);
            const blob = new Blob([data], {type: 'text/json'});

            let a = document.createElement('a');

            a.download = 'GothamHelperExport.json';
            a.href = URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            a.click();
        },
        async importData(event) {
            const file = event.target.files[0];
            if (file) {
                let reader = new FileReader();
                reader.onload = function(ev) {
                    try {
                        const parsed = JSON.parse(ev.target.result);
                        storage.seed(parsed);
                    } catch (e) {
                        console.log(e);
                    }
                }

                reader.onerror = function(ev) {
                    reaer.abort();
                    alert("Wrong file");
                }

                reader.readAsText(file);
            }
        }
    }
};
</script>
