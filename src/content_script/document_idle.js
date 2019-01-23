import { messageHandler } from '../core/Listeners.js';

chrome.runtime.onMessage.addListener(messageHandler);
