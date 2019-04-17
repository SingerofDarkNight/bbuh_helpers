<template>
  <div>
    <textarea
      v-model.trim="decoded"
      :placeholder="_('encodingHint')"
    />
    <div class="controlls">
      <GButton
        tooltip="encodeTooltip"
        icon="angle-double-down"
        @action="encodeMessage"
      />
      <GButton
        tooltip="decodeTooltip"
        icon="angle-double-up"
        @action="decodeMessage"
      />
    </div>
    <textarea v-model.trim="encoded" />
  </div>
</template>

<script>
import GButton from '../base/GButton.vue';
import gotham from 'gotham-encoder';

export default {
    name: 'GEncodingPanel',
    components: {
        GButton
    },
    data() {
        return {
            decoded: '',
            encoded: ''
        };
    },
    methods: {
        decodeMessage() {
            this.decoded = gotham.decode(this.encoded);
        },
        encodeMessage() {
            this.encoded = gotham.encode(this.decoded);
        }
    }
};
</script>

<style lang="scss">
.controlls {
    text-align: center;
}
</style>
