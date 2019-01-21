<template>
<main role="main">
    <GOptionsPanel class="optionpanel"></GOptionsPanel>
</main>
</template>

<script>
import GOptionsPanel from '../panels/GOptionsPanel.vue';

export default {
    name: 'GOptionsPage',
    components: {
        GOptionsPanel
    }
};
</script>

<style lang="scss">
.optionpanel {
    padding: 3px 5px;
    border: 1px solid #ccc;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
}
</style>
