import 'chrome-extension-async';

function isEmpty(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}

async function getUserInfo() {
    try {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        const response = await chrome.tabs.sendMessage(tabs[0].id, {type: 'user_info'});
        return response;
    } catch(e) {
        return null;
    }
}

async function getProfilesAndCookies() {
    const items = await chrome.storage.local.get('profiles');
    const results = await chrome.cookies.getAll({domain: 'bbuhot.com'});
    return {items, results};
}

async function addProfile() {
    const {items, results} = await getProfilesAndCookies();
    const response = await getUserInfo();
    if (response) {
        items.profiles[response.uid] = {
            "username": response.username,
            "cookies": results
        };
        await chrome.storage.local.set({profiles: items.profiles});
    }
}

async function removeProfile(uid) {
    const items = await chrome.storage.local.get('profiles');
    delete items.profiles[uid];
    await chrome.storage.local.set({profiles: items.profiles});
}

async function switchToProfile(uid) {
    const {items, results} = await getProfilesAndCookies();
    const response = await getUserInfo();
    if (response) {
        items.profiles[response.uid] = {
            "username": response.username,
            "cookies": results
        };
        // save current profile first
        await chrome.storage.local.set({profiles: items.profiles});
        // remove current cookies
        for (var cookie of results) {
            await chrome.cookies.remove({url: 'https://bbs.bbuhot.com', name: cookie.name});
        }

        // set cookies to the wanted profile
        let cookies = items.profiles[uid].cookies;
        for (var cookie of cookies) {
            var data = {url: 'https://bbs.bbuhot.com'};
            for (var k in cookie) {
                if (k != 'session' && k !=  'hostOnly') {
                    data[k] = cookie[k];
                }
            }
            await chrome.cookies.set(data);
        }
    } else {
        for (var cookie of results) {
            await chrome.cookies.remove({url: 'https://bbs.bbuhot.com', name: cookie.name});
        }

        // set cookies to the wanted profile
        let cookies = items.profiles[uid].cookies;
        for (var cookie of cookies) {
            var data = {url: 'https://bbs.bbuhot.com'};
            for (var k in cookie) {
                if (k != 'session' && k !=  'hostOnly') {
                    data[k] = cookie[k];
                }
            }
            await chrome.cookies.set(data);
        }
    }
}

async function removeAllCookies() {
    const results = await chrome.cookies.getAll({domain: 'bbuhot.com'});
    for (var cookie of results) {
        await chrome.cookies.remove({url: 'https://bbs.bbuhot.com', name: cookie.name});
    }
}

async function refreshTab() {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    await chrome.tabs.reload(tabs[0].id);
    await updateProfileListHTML();
    await updateCurrentProfileHTML();
}

async function createProfileListener(event) {
    await addProfile();
    await batchUpdateHTML();
}

async function changeProfileListener(event) {
    let uid = event.target.getAttribute('data-profileuid');
    await switchToProfile(uid);
    await batchUpdateHTML(true);
}

async function changeToEmptyProfileListener(event) {
    await removeAllCookies();
    await batchUpdateHTML(true);
}

async function deleteProfileListener(event) {
    let uid = event.target.getAttribute('data-profileuid');
    await removeProfile(uid);
    await batchUpdateHTML();
}

function addProfileListeners() {
    let sp_els = document.getElementsByClassName('switch_profile');
    for (var el of sp_els) {
        el.addEventListener('click', changeProfileListener, false);
    }

    let rp_els = document.getElementsByClassName('remove_profile');
    for (var el of rp_els) {
        el.addEventListener('click', deleteProfileListener, false);
    }
}

function addCommonListeners() {
    let add_profile = document.getElementById('add_profile');
    add_profile.addEventListener('click', createProfileListener, false);

    let switch_to_empty_profile = document.getElementById('switch_to_empty_profile');
    switch_to_empty_profile.addEventListener('click', changeToEmptyProfileListener, false);
}

async function updateCurrentProfileHTML() {
    const response = await getUserInfo();
    const items = await chrome.storage.local.get('profiles');
    let el = document.getElementById('current_profile');
    if (response && items.profiles[response.uid]) {
        el.innerHTML = response.username;
    } else {
        el.innerHTML = "No Documented Profile";
    }
}

async function updateProfileListHTML() {
    const items = await chrome.storage.local.get('profiles');
    let profiles = items.profiles;
    let profile_list = document.getElementById('profile_list');

    if (isEmpty(profiles)) {
        profile_list.innerHTML = '<p class="empty">No Profile exist</p>';
    } else {
        var html_str = '';
        for (let uid in profiles) {
            html_str += '<p>' +
                profiles[uid].username +
                '&nbsp;<span><a href="#" class="switch_profile" data-profileuid="' +
                uid +
                '">switch</a></span>&nbsp;<span><a href="#" class="remove_profile" data-profileuid="' +
                uid +
                '">remove</a></span></p>';
        }
        profile_list.innerHTML = html_str;
        addProfileListeners();
    }
}

// TODO: can't update current profile after switching profile
async function batchUpdateHTML(refresh) {
    if (refresh) {
        await refreshTab();
    } else {
        await updateProfileListHTML();
        await updateCurrentProfileHTML();
    }
}

async function init() {
    addCommonListeners();
    await batchUpdateHTML();
}

init();
