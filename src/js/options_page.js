(function () {
    function saveUserLevelsListener(event) {
        chrome.storage.local.get('settings', function (items) {
            let el = document.querySelector('#user_levels');
            let data = el.value.split(',');
            let a = [];
            for (let i of data) {
                let num = Number.parseInt(i);
                if (Number.isNaN(num)) {
                    el.value = items.settings.user_levels.toString();
                    alert('Bad User Levels Format');
                    return false;
                }
                a.push(num);
            }
            items.settings.user_levels = a;
            chrome.storage.local.set({settings: items.settings});
        });
    }

    function trimString(str) {
        return str == null ?
            '' :
            str.toString().replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function saveMainPostLabelListener(event) {
        chrome.storage.local.get('settings', function (items) {
            let el = document.querySelector('#main_post_label');
            let data = trimString(el.value);
            items.settings.main_post_label = data;
            chrome.storage.local.set({settings: items.settings});
        });
    }

    function toggleSwitchListener(event) {
        chrome.storage.local.get('settings', function (items) {
            let name = event.target.getAttribute('name');
            items.settings[name] = !items.settings[name];
            chrome.storage.local.set({settings: items.settings}, function () {
                event.target.toggleAttribute('checked');
            });
        });
    }

    function addCommonListeners() {
        let saveMainPostLabel = document.querySelector('#save_main_post_label');
        saveMainPostLabel.addEventListener('click', saveMainPostLabelListener, false);
        let saveUserLevels = document.querySelector('#save_user_levels');
        saveUserLevels.addEventListener('click', saveUserLevelsListener, false);
        let autoSign = document.querySelector('#enable_auto_sign');
        autoSign.addEventListener('click', toggleSwitchListener, false);
        let farmKit = document.querySelector('#enable_farm_kit');
        farmKit.addEventListener('click', toggleSwitchListener, false);
        let blacklist = document.querySelector('#enable_blacklist');
        blacklist.addEventListener('click', toggleSwitchListener, false);
    }

    function updateHTML() {
        chrome.storage.local.get('settings', function (items) {
            for (let k in items.settings) {
                let data = items.settings[k];
                let el = document.querySelector('#' + k);
                if (typeof data == 'boolean') {
                    if (data) {
                        el.toggleAttribute('checked');
                    }
                } else {
                    el.value = data.toString();
                }
            }
        });
    }

    function init() {
        updateHTML();
        addCommonListeners();
    }

    init();
})();
