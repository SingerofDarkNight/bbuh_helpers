(function () {
    function isEmpty(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }

    function updateCurrentProfileHTML() {
    }

    function updateProfileListHTML() {
        chrome.storage.local.get('profiles', function (items) {
            if (isEmpty(items['profiles'])) {
                var html_str = '<tr><td id="no_profile" colspan="3">No Profile exist</td></tr>';
                var tbody = document.getElementById('profile_list');
                tbody.innerHTML = html_str;
            } else {
                var html_str = ""
                for (var profile_name in items['profiles']) {
                    html_str += '<tr><td class="profile_name">' +
                        profile_name +
                        '</td><td class=“switch"><a href="#" id="switch_'+
                        '">switch</a></td><td class="remove"><a href="#" id="remove_' +
                        '">remove</a></td></tr>';
                }
                var tbody = document.getElementById('profile_list');
                tbody.innerHTML = html_str;
            }
        });
    }

    function addProfile(name) {
        chrome.storage.local.get('profiles', function (items) {
            chrome.cookies.getAll({domain: 'bbuhot.com'}, function (results) {
                items.profiles[name] = results;
                chrome.storage.local.set({profiles: items.profiles});
            });
        });
    }

    function removeAllCookies() {
        chrome.cookies.getAll({domain: 'bbuhot.com'}, function (results) {
            for (var cookie of results) {
                chrome.cookies.remove({url: 'https://bbs.bbuhot.com', name: cookie.name});
            }
        });
    }

    function switchToProfile(name) {
        chrome.storage.local.get('profiles', function (items) {
            chrome.cookies.getAll({domain: 'bbuhot.com'}, function (results) {
                for (var cookie of results) {
                    chrome.cookies.remove({url: 'https://bbs.bbuhot.com', name: cookie.name});
                }

                for (var cookie of items['profiles'][name]) {
                    var data = {url: 'https://bbs.bbuhot.com'};
                    for (var k in cookie) {
                        if (k != 'session' && k !=  'hostOnly') {
                            data[k] = cookie[k];
                        }
                    }
                    chrome.cookies.set(data);
                }
            });
        });
    }

    function removeProfile(name) {
        chrome.storage.local.get('profiles', function (items) {
            delete items['profiles'][name];
            chrome.storage.local.set({profiles: items['profiles']});
        });
    }

    function init() {
        chrome.storage.local.get('profiles', function (items) {
            // initialize the profile before any operation
            if (isEmpty(items)) {
                chrome.storage.local.set({profiles: {}});
            }
            let add_profile = document.getElementById('add_profile');
            add_profile.addEventListener('click', function () {
                addProfile('name');
            });
            let switch_to_empty_profile = document.getElementById('switch_to_empty_profile');
            switch_to_empty_profile.addEventListener('click', function () {
                removeAllCookies();
            });

            // TODO: remove these code below
            let element = document.getElementById('remove_profile_name');
            element.addEventListener('click', function () {
                removeProfile('name');
            });
            let element1 = document.getElementById('switch_to_profile_name');
            element1.addEventListener('click', function () {
                switchToProfile('name');
            });
            updateProfileListHTML();
        });
    }

    init();
})()
