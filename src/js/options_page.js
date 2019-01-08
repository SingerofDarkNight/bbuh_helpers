import 'chrome-extension-async';

async function saveUserLevelsListener(event) {
    const items = await chrome.storage.local.get('settings');
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
    await chrome.storage.local.set({settings: items.settings});
}

function trimString(str) {
    return str == null ?
        '' :
        str.toString().replace(/^\s+/, '').replace(/\s+$/, '');
}

async function saveMainPostLabelListener(event) {
    const items = await chrome.storage.local.get('settings');
    let el = document.querySelector('#main_post_label');
    let data = trimString(el.value);
    items.settings.main_post_label = data;
    await chrome.storage.local.set({settings: items.settings});
}

async function toggleSwitchListener(event) {
    const items = await chrome.storage.local.get('settings');
    let name = event.target.getAttribute('name');
    items.settings[name] = !items.settings[name];
    await chrome.storage.local.set({settings: items.settings});
    event.target.toggleAttribute('checked');
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

async function updateHTML() {
    const items = await chrome.storage.local.get('settings');
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
}

async function init() {
    await updateHTML();
    addCommonListeners();
}

init();
