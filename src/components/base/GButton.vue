<template>
  <button
    :title="title"
    @click="handleClick"
  >
    <font-awesome-icon
      v-if="icon"
      :icon="icon"
    />
    {{ buttonText }}
  </button>
</template>

<script>
export default {
    name: 'GButton',
    props: {
        text: String,
        tooltip: String,
        icon: String
    },
    computed: {
        title() {
            return this.tooltip ? this._(this.tooltip) : null;
        },
        buttonText() {
            return this.text ? this._(this.text) : null;
        }
    },
    methods: {
        handleClick() {
            this.$emit('action');
        }
    }
};
</script>
