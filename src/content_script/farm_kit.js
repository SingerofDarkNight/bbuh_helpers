import 'chrome-extension-async';
import FarmKit from '../core/FarmKit.js';

async function init(){
    const items = await chrome.storage.local.get('settings');
    if (items.settings.enable_farm_kit) {
        new FarmKit().run();
    }
}

init();
