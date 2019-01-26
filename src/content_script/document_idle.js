import messageHandler from '../core/listeners/message.js';

chrome.runtime.onMessage.addListener(messageHandler);
