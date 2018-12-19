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
                callback();
            });
        });
    }

    function removeAllCookies(callback) {
        chrome.cookies.getAll({domain: 'bbuhot.com'}, function (results) {
            for (var cookie of results) {
                chrome.cookies.remove({url: 'https://bbs.bbuhot.com', name: cookie.name});
            }
            callback();
        });
    }

    function addProfileListeners() {
        let sp_els = document.getElementsByClassName('switch_profile');
        for (var el of sp_els) {
            el.addEventListener('click', changeProfile, false);
        }

        let rp_els = document.getElementsByClassName('remove_profile');
        for (var el of rp_els) {
            el.addEventListener('click', deleteProfile, false);
        }
    }

    function addCommonListeners() {
        let add_profile = document.getElementById('add_profile');
        add_profile.addEventListener('click', createProfile, false);

        let switch_to_empty_profile = document.getElementById('switch_to_empty_profile');
        switch_to_empty_profile.addEventListener('click', function () {
            removeAllCookies();
        });
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

    function batchUpdateHTML() {
        updateProfileListHTML();
        updateCurrentProfileHTML();
    }

    function createProfile(event) {
        addProfile(batchUpdateHTML);
    }

    function changeProfile(event) {
        let uid = event.target.getAttribute('data-profileuid');
        switchToProfile(uid, batchUpdateHTML);
    }

    function changeToEmptyProfile(event) {
        removeAllCookies(batchUpdateHTML);
    }

    function deleteProfile(event) {
        let uid = event.target.getAttribute('data-profileuid');
        removeProfile(uid, batchUpdateHTML);
    }

    function init() {
        chrome.storage.local.get('profiles', function (items) {
            // initialize the profile before any operation
            if (isEmpty(items)) {
                chrome.storage.local.set({profiles: {}});
            }

            addCommonListeners();

            batchUpdateHTML();

        });
    }

    init();
})()
