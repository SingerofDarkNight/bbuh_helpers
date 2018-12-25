(function () {
    function isEmpty(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }

    function addProfile(callback) {
        chrome.storage.local.get('profiles', function (items) {
            chrome.cookies.getAll({domain: 'bbuhot.com'}, function (results) {
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {type: 'user_info'}, function (response) {
                        items.profiles[response.uid] = {
                            "username": response.username,
                            "cookies": results
                        };
                        chrome.storage.local.set({profiles: items.profiles});
                        callback();
                    });
                });
            });
        });
    }

    function removeProfile(uid, callback) {
        chrome.storage.local.get('profiles', function (items) {
            delete items.profiles[uid];
            chrome.storage.local.set({profiles: items.profiles});
            callback();
        });
    }

    function switchToProfile(uid, callback) {
        chrome.storage.local.get('profiles', function (items) {
            chrome.cookies.getAll({domain: 'bbuhot.com'}, function (results) {
                for (var cookie of results) {
                    chrome.cookies.remove({url: 'https://bbs.bbuhot.com', name: cookie.name});
                }
                let cookies = items.profiles[uid].cookies;

                for (var cookie of cookies) {
                    var data = {url: 'https://bbs.bbuhot.com'};
                    for (var k in cookie) {
                        if (k != 'session' && k !=  'hostOnly') {
                            data[k] = cookie[k];
                        }
                    }
                    chrome.cookies.set(data);
                }
                callback(true);
            });
        });
    }

    function removeAllCookies(callback) {
        chrome.cookies.getAll({domain: 'bbuhot.com'}, function (results) {
            for (var cookie of results) {
                chrome.cookies.remove({url: 'https://bbs.bbuhot.com', name: cookie.name});
            }
            callback(true);
        });
    }

    function refreshTab() {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.reload(tabs[0].id, function () {
                updateProfileListHTML();
                updateCurrentProfileHTML();
            });
        });
    }

    function createProfileListener(event) {
        addProfile(batchUpdateHTML);
    }

    function changeProfileListener(event) {
        let uid = event.target.getAttribute('data-profileuid');
        switchToProfile(uid, batchUpdateHTML);
    }

    function changeToEmptyProfileListener(event) {
        removeAllCookies(batchUpdateHTML);
    }

    function deleteProfileListener(event) {
        let uid = event.target.getAttribute('data-profileuid');
        removeProfile(uid, batchUpdateHTML);
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

    function updateCurrentProfileHTML() {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'user_info'}, function (response) {
                chrome.storage.local.get('profiles', function (items) {
                    let el = document.getElementById('current_profile');
                    if (response && items.profiles[response.uid]) {
                        el.innerHTML = response.username;
                    } else {
                        el.innerHTML = "Empty Profile";
                    }
                });
            });
        });
    }

    function updateProfileListHTML() {
        chrome.storage.local.get('profiles', function (items) {
            if (isEmpty(items.profiles)) {
                var html_str = '<p id="no_profile">No Profile exist</p>';
                let profile_list = document.getElementById('profile_list');
                profile_list.innerHTML = html_str;
            } else {
                let profiles = items.profiles;
                var html_str = '';
                for (var uid in profiles) {
                    html_str += '<p>' +
                        profiles[uid].username +
                        '&nbsp;<span><a href="#" class="switch_profile" data-profileuid="' +
                        uid +
                        '">switch</a></span>&nbsp;<span><a href="#" class="remove_profile" data-profileuid="' +
                        uid +
                        '">remove</a></span></p>';
                }

                let profile_list = document.getElementById('profile_list');
                profile_list.innerHTML = html_str;

                addProfileListeners();
            }
        });
    }

    // TODO: can't update current profile after switching profile
    function batchUpdateHTML(refresh) {
        if (refresh) {
            refreshTab();
        } else {
            updateProfileListHTML();
            updateCurrentProfileHTML();
        }
    }

    function init() {
        addCommonListeners();
        batchUpdateHTML();
    }

    init();
})()
