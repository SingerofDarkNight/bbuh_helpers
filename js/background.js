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
