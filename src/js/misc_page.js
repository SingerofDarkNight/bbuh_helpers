import 'chrome-extension-async';

async function toggleState(name) {
    const items = await chrome.storage.local.get('misc');
    items.misc[name] = !items.misc[name];
    await chrome.storage.local.set({misc: items.misc});
}

async function changeMinLevel(index) {
    const items = await chrome.storage.local.get('misc');
    items.misc.min_level = index;
    await chrome.storage.local.set({misc: items.misc});
}

async function toggleHideMedalsListener(event) {
    await toggleState('hide_medals');
    updateToggleHTML('hide_medals');
}

async function toggleHideSignsListener(event) {
    await toggleState('hide_signs');
    updateToggleHTML('hide_signs');
}

async function toggleHideRepliesListener(event) {
    await toggleState('hide_replies');
    updateToggleHTML('hide_replies');
}

async function changeMinLevelListener(event) {
    let target = event.target;
    await changeMinLevel(target.selectedIndex);
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

async function batchUpdateHTML() {
    const items = await chrome.storage.local.get(['misc', 'settings']);
    // setting up the select options
    let user_levels = items.settings.user_levels;
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
}

function init() {
    batchUpdateHTML();
    addCommonListeners()
}

init();
