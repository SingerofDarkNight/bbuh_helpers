<template>
<div v-if="loaded">
    <p>Current Profile: <span>{{ current ? current : "No tracked Profile" }}</span></p>
    <div>
        <button v-on:click="create">Add Profile</button>
        <button v-on:click="switchToEmpty">Switch to Empty Profile</button>
    </div>
    <div>
        <h2>Profile List</h2>
        <div>
            <p v-for="(username, uid) in profiles">
                {{ username }}
                <span v-on:click="switchTo(uid)">Switch</span>
                <span v-on:click="remove(uid)">Remove</span>
            </p>
        </div>
    </div>
</div>
<div v-else>
    <p>loading</p>
</div>
</template>

<script>
import cookies from '../../core/cookies.js';
import messages from '../../core/messages.js';
import storage from '../../core/storage.js';

export default {
    name: 'GProfilesPanel',
    data() {
        return {
            loaded: false,
            current: null,
            current_uid: null,
            profiles: {}
        };
    },
    async created() {
        // set profiles list
        const profiles = await storage.get('profiles');
        for (let uid in profiles) {
            this.profiles[uid] = profiles[uid].username;
        }
        // set current
        const res = await messages.send('user_info');
        if (res && this.profiles[res.uid]) {
            this.current = res.username;
            this.current_uid = res.uid;
        }
        // set loaded to true
        this.loaded = true;
    },
    methods: {
        async create() {
            const res = await messages.send('user_info');
            if (res) {
                const results = await cookies.getAll();
                let profiles = await storage.get('profiles');
                profiles[res.uid] = {
                    'username': res.username,
                    'cookies': results
                };
                await storage.save('profiles', profiles);

                this.current = res.username;
                this.current_uid = res.uid;
                this.profiles[res.uid] = res.username;
            }
        },
        async remove(uid) {
            let profiles = await storage.get('profiles');
            delete profiles[uid];
            await storage.save('profiles', profiles);
            this.$delete(this.profiles, uid);
            if (uid == this.current_uid) {
                this.current = null;
                this.current_uid = null;
            }
        },
        async switchTo(uid) {
            const res = await messages.send('user_info');
            const results = await cookies.getAll();
            let profiles = await storage.get('profiles');
            // update current profiles
            if (res) {
                profiles[res.uid] = {
                    'username': res.username,
                    'cookies': results
                };
                await storage.save('profiles', profiles);
            }
            //remove all cookies
            await cookies.removeAll(results);
            await cookies.setAll(profiles[uid].cookies);
            await messages.refresh();
            this.current = profiles[uid].username;
            this.current_uid = uid;
        },
        async switchToEmpty() {
            await cookies.removeAll();
            await messages.refresh();
            this.current = null;
            this.current_uid = null;
        }
    }
};
</script>

<style lang="scss">
</style>
