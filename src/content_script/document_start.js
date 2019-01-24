import 'chrome-extension-async';
import storage from '../core/base/storage.js';
import Matcher from '../core/Matcher.js';
import ExtraEmojis from '../core/ExtraEmojis.js';
import {
    BlockSigns,
    BlockMedals,
    BlockReplyByUserGroups,
    BlockReplyByBlacklist,
    BlockThreadByBlacklist,
    ForumModifier
} from '../core/ForumModifier.js';

async function init() {
    const items = await storage.get('blacklist', 'extemojis', 'misc', 'settings');
    const { settings, misc } = items;
    const matcher = new Matcher(document);

    let ops = [];

    // blocking
    if (settings.enable_blacklist && matcher.isForumPage) {
        ops.push(BlockThreadByBlacklist);
    } else if (matcher.isThreadPage) {
        if (misc.hide_medals) ops.push(BlockMedals);
        if (misc.hide_signs) ops.push(BlockSigns);
        if (misc.hide_replies) ops.push(BlockReplyByUserGroups);
        if (settings.enable_blacklist) ops.push(BlockReplyByBlacklist);
    }

    // additional
    if (settings.enable_extemojis && matcher.containsEditorPage) {
        ops.push(ExtraEmojis);
    }

    if (ops.length > 0) {
        new ForumModifier(ops, items).run();
    }
}

init();
