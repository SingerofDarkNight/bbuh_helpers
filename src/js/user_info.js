chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == 'user_info') {
        el = document.querySelector('a[title="访问我的空间"]');
        if (el) {
            var username = el.textContent;
            var uid = el.href.match(/\d+/)[0];
            sendResponse({"username": username, "uid": uid});
        }
    }
});
