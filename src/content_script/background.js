import 'chrome-extension-async';
import installFixtureHandler from '../core/listeners/install.js';
import pageActionHandler from '../core/listeners/page_action.js';

// show and hide page actions
chrome.tabs.onUpdated.addListener(pageActionHandler);

// setting up required info
chrome.runtime.onInstalled.addListener(installFixtureHandler);
