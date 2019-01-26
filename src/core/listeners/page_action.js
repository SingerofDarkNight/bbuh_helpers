import { bbuh_site_url } from '../base/consts.js';

export default function pageActionHandler(tabId, changeInfo, tab) {
    if (tab.url.indexOf(bbuh_site_url) == 0) {
        chrome.pageAction.show(tabId);
    } else {
        // TODO(luciusgone): BUG. no tab id error
        chrome.pageAction.hide(tabId);
    }
}
