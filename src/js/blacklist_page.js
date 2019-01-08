import 'chrome-extension-async';

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

async function addToList(type) {
    let input = document.querySelector('input[name=keyword]');
    console.log(input);
    let inputvalue = trimString(input.value);
    if (inputvalue == '') {
        return false;
    }

    const items = await chrome.storage.local.get('blacklist');
    if (!items.blacklist[inputvalue]) {
        items.blacklist[inputvalue] = type;
    } else {
        items.blacklist[inputvalue] = 'both';
    }
    await chrome.storage.local.set({blacklist: items.blacklist});
}

async function removeFromList(keyword, callback) {
    const items = await chrome.storage.local.get('blacklist');
    delete items.blacklist[keyword];
    await chrome.storage.local.set({blacklist: items.blacklist});
}

async function blacklistUserListener(event) {
    await addToList('user');
    await updateBlacklistHTML();
}

async function blacklistKeywordListener(event) {
    await addToList('keyword');
    await updateBlacklistHTML();
}

async function removeFromBlacklistListener(event) {
    let keyword = event.target.getAttribute('data-blacklistname');
    await removeFromList(keyword);
    await updateBlacklistHTML();
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

async function updateBlacklistHTML() {
    const items = await chrome.storage.local.get('blacklist');

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
}

function init() {
    addCommonListeners();
    updateBlacklistHTML();
}

init();
