<template>
<div id="app">
    <header>
        <h1>Gotham Helpers</h1>
        <button v-on:click="toggleOptionsPage">Options</button>
    </header>
    <component v-bind:is="currentPage" class="main"></component>
</div>
</template>

<script>
import GTabsPage from './pages/GTabsPage.vue';
import GOptionsPage from './pages/GOptionsPage.vue';

export default {
    name: 'GApp',
    data() {
        return {
            isOptionsPageVisible: false
        };
    },
    components: {
        GTabsPage,
        GOptionsPage
    },
    computed: {
        currentPage() {
            return this.isOptionsPageVisible ? "GOptionsPage" : "GTabsPage";
        }
    },
    methods: {
        toggleOptionsPage() {
            this.isOptionsPageVisible = !this.isOptionsPageVisible;
        }
    }
};
</script>

<style lang="scss">
// use border-box for everything
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0px;
    padding: 0px;
}

// app container
#app {
    width: 320px;
    max-height: 640px;
    font-family: sans-serif;
}

// header part
header {
    padding: 0 5px;
}

// main app
.main {
    padding: 0 5px;
}


h1 {
    display: inline-block;
    font: 20px monospace;
    padding: 3px 5px;
}

button {
    background: black;
    color: white;
    margin: 2px;
    padding: 1px 3px;
    border: 1px;
    border-radius: 3px;
}
</style>
