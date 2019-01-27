<template>
  <div>
    <textarea
      v-model.trim="decoded"
      :placeholder="_('encodingHint')"
    />
    <div class="controlls">
      <button
        type="button"
        :title="_('encodeTooltip')"
        @click="encodeMessage"
      >
        <font-awesome-icon icon="angle-double-down" />
      </button>
      <button
        type="button"
        :title="_('decodeTooltip')"
        @click="decodeMessage"
      >
        <font-awesome-icon icon="angle-double-up" />
      </button>
    </div>
    <textarea v-model.trim="encoded" />
  </div>
</template>

<script>
import gotham from 'gotham-encoder';

export default {
    name: 'GEncodingPanel',
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
