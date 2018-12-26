(function () {
    function isEmpty(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }

    function trimString(str) {
        return str == null ?
            '' :
            str.toString().replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function addToList(type, callback) {
        let input = document.querySelector('input[name=keyword]');
        console.log(input);
        let inputvalue = trimString(input.value);
        if (inputvalue == '') {
            return false;
        }
        chrome.storage.local.get('blacklist', function (items) {
            if (!items.blacklist[inputvalue]) {
                items.blacklist[inputvalue] = type;
            } else {
                items.blacklist[inputvalue] = 'both';
            }
            chrome.storage.local.set({blacklist: items.blacklist}, callback);
        });
    }

    function removeFromList(keyword, callback) {
        chrome.storage.local.get('blacklist', function (items) {
            delete items.blacklist[keyword];
            chrome.storage.local.set({blacklist: items.blacklist}, callback);
        });
    }

    function blacklistUserListener(event) {
        addToList('user', updateBlacklistHTML);
    }

    function blacklistKeywordListener(event) {
        addToList('keyword', updateBlacklistHTML);
    }

    function removeFromBlacklistListener(event) {
        let keyword = event.target.getAttribute('data-blacklistname');
        removeFromList(keyword, updateBlacklistHTML);
    }

    function addCommonListeners() {
        let block_user = document.getElementById('block_user');
        block_user.addEventListener('click', blacklistUserListener, false);
        let block_keyword = document.getElementById('block_keyword');
        block_keyword.addEventListener('click', blacklistKeywordListener, false);
    }

    function addRemovalListeners() {
        let removal_els = document.getElementsByClassName('remove_keyword');
        for (let el of removal_els) {
            el.addEventListener('click', removeFromBlacklistListener, false);
        }
    }

    function updateBlacklistHTML() {
        chrome.storage.local.get('blacklist', function (items) {
            let blacklist = items.blacklist;
            let blacklist_el = document.getElementById('blacklist');
            if (isEmpty(blacklist)) {
                blacklist_el.innerHTML = '<p class="empty">No Blacklisted Keyword</p>';
            } else {
                var html_str = '';
                for (let keyword in blacklist) {
                    html_str += '<p>' +
                        keyword +
                        '&nbsp;<span class="blacklist_type">' +
                        blacklist[keyword] +
                        '</span>&nbsp;<span><a href="#" class="remove_keyword" data-blacklistname="' +
                        keyword +
                        '">remove</a></span></p>';
                }
                blacklist_el.innerHTML = html_str;
                addRemovalListeners();
            }
        });
    }

    function init() {
        addCommonListeners();
        updateBlacklistHTML();
    }

    init();
})();
