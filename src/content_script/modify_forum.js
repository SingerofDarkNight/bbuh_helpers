import 'chrome-extension-async';
import { BlockThreadByBlacklist, ForumModifier } from '../core/ForumModifier.js';

async function init() {
    const items = await chrome.storage.local.get(['blacklist', 'settings']);
    if (items.settings.enable_blacklist) {
        new ForumModifier([BlockThreadByBlacklist], items).run();
    }
}

init();
