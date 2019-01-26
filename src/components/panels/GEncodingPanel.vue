<template>
<div>
    <textarea v-model.trim="decoded" v-bind:placeholder="_('encodingHint')"></textarea>
    <div class="controlls">
        <button type="button"
                v-on:click="encodeMessage"
                v-bind:title="_('encodeTooltip')">&darr;</button>
        <button type="button"
                v-on:click="decodeMessage"
                v-bind:title="_('decodeTooltip')">&uarr;</button>
    </div>
    <textarea v-model.trim="encoded"></textarea>
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
