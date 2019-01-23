import { bbuh_site_url } from './base/consts.js';
import storage from './base/storage.js';
import fixture from './data/fixture.json';

export function messageHandler(request, sender, sendResponse) {
    if (request.type == 'user_info') {
        const el = document.querySelector('a[title="访问我的空间"]');
        if (el) {
            var username = el.textContent;
            var uid = el.href.match(/\d+/)[0];
            sendResponse({"username": username, "uid": uid});
        }
    }
}

export function pageActionHandler(tabId, changeInfo, tab) {
    if (tab.url.indexOf(bbuh_site_url) == 0) {
        chrome.pageAction.show(tabId);
    } else {
        // TODO(luciusgone): BUG. no tab id error
        chrome.pageAction.hide(tabId);
    }
}

export async function installFixtureHandler(details) {
    const items = await storage.get('profiles', 'blacklist', 'misc', 'settings');
    if (Object.keys(items).length == 0) {
        await storage.seed(fixture);
    }
}
