<template>
<div>
    <textarea v-model.trim="decoded" placeholder="What to encode today? Mr Wayne."></textarea>
    <div>
        <button type="button" v-on:click="encodeMessage">&darr;</button>
        <button type="button" v-on:click="decodeMessage">&uarr;</button>
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
</style>
