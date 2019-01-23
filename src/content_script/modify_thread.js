import 'chrome-extension-async';
import {
    BlockSigns,
    BlockMedals,
    BlockReplyByUserGroups,
    BlockReplyByBlacklist,
    ForumModifier
} from '../core/ForumModifier.js';

async function init() {
    const items = await chrome.storage.local.get(['misc', 'settings', 'blacklist']);
    new ForumModifier([
        BlockSigns,
        BlockMedals,
        BlockReplyByUserGroups,
        BlockReplyByBlacklist
    ], items).run();
}

init();
