import 'chrome-extension-async';
import storage from '../core/base/storage.js';
import AutoSigner from '../core/AutoSigner.js';
import FarmKit from '../core/FarmKit.js';
import Matcher from '../core/Matcher.js';

async function init() {
    const settings = await storage.get('settings');
    const matcher = new Matcher(document);

    if (settings.enable_auto_sign && matcher.isSignPage) {
        new AutoSigner(settings.todaysay).run();
    }

    if (settings.enable_farm_kit && matcher.isThreadPage) {
        new FarmKit().run();
    }
}

init();
