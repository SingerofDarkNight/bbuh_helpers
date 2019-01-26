export default {
    methods: {
        _(...args) {
            return chrome.i18n.getMessage(...args);
        }
    }
}
