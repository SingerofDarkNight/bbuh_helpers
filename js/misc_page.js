(function () {
    function toggleState(name, callback) {
        chrome.storage.local.get('misc', function (items) {
            items.misc[name] = !items.misc[name];
            chrome.storage.local.set({misc: items.misc}, function () {
                callback(name);
            });
        });
    }

    function changeMinLevel(index) {
        chrome.storage.local.get('misc', function(items) {
            items.misc.min_level = index;
            chrome.storage.local.set({misc: items.misc});
        });
    }

    function toggleHideMedalsListener(event) {
        toggleState('hide_medals', updateToggleHTML);
    }

    function toggleHideSignsListener(event) {
        toggleState('hide_signs', updateToggleHTML);
    }

    function toggleHideRepliesListener(event) {
        toggleState('hide_replies', updateToggleHTML);
    }

    function changeMinLevelListener(event) {
        let target = event.target;
        changeMinLevel(target.selectedIndex);
    }

    function addCommonListeners() {
        let hidemedals = document.getElementById('hide_medals');
        hide_medals.addEventListener('click', toggleHideMedalsListener, false);
        let hidesigns = document.getElementById('hide_signs');
        hide_signs.addEventListener('click', toggleHideSignsListener, false);
        let hidereplies = document.getElementById('hide_replies');
        hide_replies.addEventListener('click', toggleHideRepliesListener, false);
        let userlevel = document.getElementById('user_level');
        userlevel.addEventListener('change', changeMinLevelListener, false);
    }

    function updateToggleHTML(id) {
        let el = document.getElementById(id);
        el.toggleAttribute('checked');
    }

    function batchUpdateHTML() {
        chrome.storage.local.get(['misc', 'settings'], function (items) {
            // setting up the select options
            user_levels = items.settings.user_levels;
            var html_str = '';
            for (let i = 0; i < user_levels.length; i++) {
                html_str += '<option value="' + user_levels[i] + '">' + i + '</options>'
            }
            let ul_el = document.getElementById('user_level');
            ul_el.innerHTML = html_str;
            ul_el.selectedIndex = items.misc.min_level;

            // update the toggles
            ['hide_medals', 'hide_signs', 'hide_replies'].forEach(function (i) {
                if (items.misc[i]) {
                    updateToggleHTML(i);
                }
            });
        });
    }

    function init() {
        batchUpdateHTML();
        addCommonListeners()
    }

    init();
})();
