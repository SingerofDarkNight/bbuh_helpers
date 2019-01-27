import { HTML2BBCode } from 'html2bbcode';

const Converter = new HTML2BBCode();

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

// TODO(luciusgone): substitute emotion icon
function extractData(node) {
    let cp = node.cloneNode(true);

    // extra data by discuz
    let extras = cp.querySelectorAll('.tip');
    for (let e of extras) {
        if (e) e.remove();
    }

    // extra data by farmkit
    let farmkit_extras = cp.querySelectorAll('.bbuhfarmkit');
    for (let e of farmkit_extras) {
        if (e) e.remove();
    }

    return cp.innerHTML;
}

function fastFarm(node) {
    let extracted = extractData(node);
    let bbcode = Converter.feed(extracted);

    let fastpostmessage = document.querySelector('#fastpostmessage');
    fastpostmessage.value = bbcode;
    document.querySelector('#fastpostsubmit').click();
}

export function handlePost(event) {
    const target = event.target;
    const post_el = getAncestorElement(target, 8);
    const postmessage = post_el.querySelector('td[id^=postmessage]');

    fastFarm(postmessage);
}

handlePost.text = chrome.i18n.getMessage('labelCopyPost');
handlePost.anchorsSelector = '.pti > .authi';


export function handleSign(event) {
    const sign_el = event.target.parentElement;

    fastFarm(sign_el);
}

handleSign.text = chrome.i18n.getMessage('labelCopySign');
handleSign.anchorsSelector = '.sign';

export default class FarmKit {
    constructor(...kits) {
        if (kits.length > 0) {
            this.kits = kits;
        } else {
            this.kits = [handlePost, handleSign];
        }
    }

    run() {
        for (let kit of this.kits) {
            this.insertKit(kit);
        }
    }

    insertKit(kit) {
        const els = document.querySelectorAll(kit.anchorsSelector);

        for (let el of els) {
            this.addAnchor(kit.text, el, kit);
        }
    }

    addAnchor(name, node, listener) {
        let el = document.createElement('a');
        el.innerHTML = name;
        // add className
        el.className = 'bbuhfarmkit';
        // setting sytles
        el.style.color = 'green';
        el.style.cursor = 'pointer';
        el.style.cssFloat = 'right';
        el.style.lineHeight = '16px';
        el.style.padding = '0px 6px';
        // binding events
        el.addEventListener('click', listener, false);
        // attach to DOM
        node.appendChild(el);
    }
}
