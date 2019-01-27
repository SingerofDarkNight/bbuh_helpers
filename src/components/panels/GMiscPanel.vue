<template>
  <div v-if="loaded">
    <p>
      <input
        v-model="hide_medals"
        type="checkbox"
        name="hide_medals"
        @change="toggle('hide_medals')"
      >
      <label for="hide_medals">
        {{ _('labelHideMedal') }}
      </label>
    </p>
    <p>
      <input
        v-model="hide_signs"
        type="checkbox"
        name="hide_signs"
        @change="toggle('hide_signs')"
      >
      <label for="hide_signs">
        {{ _('labelHideSign') }}
      </label>
    </p>
    <p>
      <input
        v-model="hide_replies"
        type="checkbox"
        name="hide_replies"
        @change="toggle('hide_replies')"
      >
      <label for="hide_replies">
        {{ _('labelHideReply') }}
      </label>

      <select
        v-model="min_level"
        name="user_levels"
        :disabled="!hide_replies"
        @change="updateMinLevel"
      >
        <option
          v-for="(item, index) in user_levels"
          :key="index"
        >
          {{ index }}
        </option>
      </select>
    </p>
  </div>
  <div v-else>
    <p>{{ _('labelLoading') }}</p>
  </div>
</template>

<script>
import storage from '../../core/base/storage.js';

export default {
    name: 'GMiscPanel',
    data() {
        return {
            loaded: false,
            hide_medal: false,
            hide_signs: false,
            hide_replies: false,
            min_level: 0,
            user_levels: []
        };
    },
    async created() {
        const misc = await storage.get('misc');
        for (let k in misc) {
            if (Array.isArray(misc[k])) {
                this[k] = misc[k].slice();
            } else {
                this[k] = misc[k];
            }
        }
        this.loaded = true;
    },
    methods: {
        async toggle(sw) {
            let misc = await storage.get('misc');
            misc[sw] = !misc[sw];
            await storage.save('misc', misc);
        },
        async updateMinLevel() {
            let misc = await storage.get('misc');
            misc.min_level = Number.parseInt(this.min_level);
            await storage.save('misc', misc);
        }
    }
};
</script>
