import 'chrome-extension-async';
import AutoSigner from '../core/AutoSigner.js';


async function init() {
    const items = await chrome.storage.local.get('settings');
    if (items.settings.enable_auto_sign) {
        new AutoSigner().run();
    }
}

init();
