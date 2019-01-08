import 'chrome-extension-async';

function fastFarm(post) {
    let fastpostmessage = document.getElementById('fastpostmessage');
    fastpostmessage.value = post;
    document.getElementById('fastpostform').submit();
}

function getAncestorElement(node, num) {
    var el = node;
    for (let i = 1; i <= num; i++) {
        if (el) {
            el = el.parentElement;
        } else {
            return el;
        }
    }
    return el;
}

function copyPostListener(event) {
    let target = event.target;
    let post_el = getAncestorElement(target, 8);
    let postmessage = post_el.querySelector('td[id^=postmessage]');
    // TODO: substitue the image emoji
    let post_str = postmessage.innerText;
    post_str.replace(/^\s*/, '');
    fastFarm(post_str);
}

function copySignImageListener(event) {
    let sign_el = event.target.parentElement;
    sign_imgs = sign_el.getElementsByTagName('img');
    let post_str = '';
    for (let img of sign_imgs) {
        post_str += '[img]' + img.src + '[/img]';
    }

    fastFarm(post_str);
}

function copySignTextListener(event) {
    let sign_el = event.target.parentElement;
    let sign_text = sign_el.innerText;
    // TODO: find a better way to avoid strict replacing
    sign_text = sign_text.replace(/Copy\sSignature\sText/, '');
    sign_text = sign_text.replace(/Copy\sSignature\sImage/, '');

    fastFarm(sign_text);
}

function addFastFarmHTML(name, parentNode, listener) {
    let el = document.createElement('a');
    el.innerHTML = name;
    // setting sytles
    el.style.color = 'green';
    el.style.cursor = 'pointer';
    el.style.cssFloat = 'right';
    el.style.lineHeight = '16px';
    el.style.padding = '0px 6px';
    // binding events
    el.addEventListener('click', listener, false);
    // attach to DOM
    parentNode.appendChild(el);
}

function addCopyPostHTML() {
    let author_infos = document.querySelectorAll('.pti > .authi');

    for (let authi of author_infos) {
        addFastFarmHTML('Copy Post', authi, copyPostListener);
    }
}

function addCopySignHTML() {
    let signs = document.getElementsByClassName('sign');

    for (let sign of signs) {
        let sign_imgs = sign.getElementsByTagName('img');
        let sign_text = sign.innerText.replace(/^\s*/, '');

        if (sign_imgs.length > 0) {
            addFastFarmHTML('Copy Signature Image', sign, copySignImageListener);
        }

        if (sign_text.length > 0) {
            addFastFarmHTML('Copy Signature Text', sign, copySignTextListener);
        }
    }
}

async function init(){
    const items = await chrome.storage.local.get('settings');
    if (items.settings.enable_farm_kit) {
        addCopyPostHTML();
        addCopySignHTML();
    }
}

init();
