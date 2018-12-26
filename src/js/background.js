// show and hide page actions
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.indexOf("https://bbs.bbuhot.com/") == 0) {
        chrome.pageAction.show(tabId);
    } else {
        chrome.pageAction.hide(tabId);
    }
});

// TODO: remove this when all things works well
// logging cookie changes
chrome.cookies.onChanged.addListener(function (changeInfo) {
    console.log("Cookie Changed " + JSON.stringify(changeInfo.cookie));
});

// setting up required info
chrome.runtime.onInstalled.addListener(function (details) {
    chrome.storage.local.get(['profiles', 'misc', 'settings'], function (items) {
        if (Object.keys(items).length == 0) {
            chrome.storage.local.set({
                profiles: {},
                misc: {
                    hide_medals: false,
                    hide_signs: false,
                    hide_replies: false,
                    min_level: 0
                },
                blacklist: {},
                settings: {
                    // TODO: prepopulating the rigid data might not be a good
                    // idea
                    user_levels: [9, 32, 10, 11, 12, 13, 14, 15, 28, 29, 30, 31],
                    main_post_label: '基地',
                    enable_auto_sign: true,
                    enable_farm_kit: true
                }
            });
        }
    });
});
