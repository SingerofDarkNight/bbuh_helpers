<template>
  <div v-if="loaded">
    <p>
      {{ _('currentProfileLabel') }}<span class="currentprofile">
        {{ current ? current : _('noCurrentProfile') }}
      </span>
    </p>
    <div class="controlls">
      <GButton
        tooltip="addTooltip"
        icon="plus"
        @action="create"
      />
      <GButton
        tooltip="emptyTooltip"
        icon="eraser"
        @action="switchToEmpty"
      />
    </div>
    <div v-if="!isEmpty(profiles)">
      <h2>{{ _('profileListHeading') }}</h2>
      <div id="listcontainer">
        <p
          v-for="(username, uid) in profiles"
          :key="uid"
          class="listitem"
        >
          <span class="username">
            {{ username }}
          </span>
          <span
            class="switch"
            :title="_('switchTooltip')"
            @click="switchTo(uid)"
          >
            <font-awesome-icon icon="exchange-alt" />
          </span>
          <span
            class="remove"
            :title="_('deleteTooltip')"
            @click="remove(uid)"
          >
            <font-awesome-icon icon="trash-alt" />
          </span>
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>{{ _('labelLoading') }}</p>
  </div>
</template>

<script>
import GButton from '../base/GButton.vue';

import cookies from '../../core/base/cookies.js';
import messages from '../../core/base/messages.js';
import storage from '../../core/base/storage.js';
import isEmpty from '../mixins/isEmpty.js';

export default {
    name: 'GProfilesPanel',
    components: {
        GButton
    },
    mixins: [isEmpty],
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
.currentprofile {
    font-style:bold;
    font-family: monospace;
    color: darkcyan;
}

// controlls style are set in GEncodingPanel

//listcontainer and listitem style are set in GBlacklistPanel

.username {
    width: 80%;
}

.switch {
    width: 10%;
    cursor: pointer;
    text-align: center;
}

.switch:hover {
    text-decoration: underline;
    color: darkcyan;
}

// remove button style are set in GBlacklistPanel
</style>
