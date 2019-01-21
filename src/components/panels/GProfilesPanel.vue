<template>
<div v-if="loaded">
    <p>Current Profile: <span>{{ current ? current : "No tracked Profile" }}</span></p>
    <div>
        <button v-on:click="create">Add Profile</button>
        <button v-on:click="switchToEmpty">Switch to Empty Profile</button>
    </div>
    <div>
        <h2>Profile List</h2>
        <div id="listcontainer">
            <p class="listitem" v-for="(username, uid) in profiles">
                <span class="username">{{ username }}</span>
                <span class="switch" v-on:click="switchTo(uid)">Switch</span>
                <span class="remove"v-on:click="remove(uid)">Remove</span>
            </p>
        </div>
    </div>
</div>
<div v-else>
    <p>loading</p>
</div>
</template>

<script>
import cookies from '../../core/base/cookies.js';
import messages from '../../core/base/messages.js';
import storage from '../../core/base/storage.js';

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
//listcontainer and listitem style are set in GBlacklistPanel

.username {
    width: 60%;
}

.switch {
    width: 20%;
    cursor: pointer;
}

.switch:hover {
    text-decoration: underline;
    color: darkcyan;
}

// remove button style are set in GBlacklistPanel
</style>
