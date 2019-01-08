document.querySelector('#options_ui').addEventListener('click', function () {
    if (chrome.runtime.openOptionPage) {
        chrome.runtime.openOptionPage();
    } else {
        window.open(chrome.runtime.getURL('html/options.html'));
    }
});
