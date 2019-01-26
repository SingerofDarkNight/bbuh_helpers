export default function messageHandler(request, sender, sendResponse) {
    if (request.type == 'user_info') {
        const el = document.querySelector('a[title="访问我的空间"]');
        if (el) {
            var username = el.textContent;
            var uid = el.href.match(/\d+/)[0];
            sendResponse({"username": username, "uid": uid});
        }
    }
}

