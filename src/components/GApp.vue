<template>
<div id="app">
    <header>
        <h1>Gotham Helpers</h1>
        <button v-on:click="toggleOptionsPage">{{ caption }}</button>
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
        },
        caption() {
            return this.isOptionsPageVisible ? "X" : "Options";
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
    font: 14px sans-serif;
}

// header
header {
    display: flex;
    padding: 0 5px;
}

// main part
.main {
    padding: 0 5px;
    margin-top: 5px;
    display: flex;
    flex-flow: column;
}

// common styles
h1 {
    font: 24px monospace;
}

h2 {
    font: 20px monospace;
    padding: 0 1px;
}

h3 {
    font: 16px monospace;
    padding: 0 3px;
}

p {
    padding: 1px 5px;
}

button {
    font-family: monospace;
    background: darkcyan;
    color: white;
    padding: 3px 5px;
    border: 1px;
    border-radius: 5px;
}

input[type=text] {
    width: 100%;
    font-size: 14px;
    padding: 1px 5px;
    margin: 3px 0;
}

textarea {
    width: 100%;
    height: 120px;
    border: 1px solid black;
    border-radius: 5px;
    padding: 5px 5px;
    resize: none;
}

// header content
header > h1 {
    display: inline-block;
    width: 90%;
}

header > button {
    display: 10%;
    align-self: center;
}
</style>
