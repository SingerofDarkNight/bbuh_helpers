import 'chrome-extension-async';
import { pageActionHandler, installFixtureHandler } from '../core/Listeners.js'

// show and hide page actions
chrome.tabs.onUpdated.addListener(pageActionHandler);

// setting up required info
chrome.runtime.onInstalled.addListener(installFixtureHandler);
