//TODO(luciusgone): we have to keep styles here because they have higher precedence than external css file
const buttonStyle = 'float: right; background: #f2f2f2; padding-right: 5px;';

const buttonImgStyle = 'cursor: pointer;';

const containerStyle = 'box-sizing: border-box; width: 300px;' +
                       ' max-height: 240px; overflow-y: scroll;' +
                       ' background: #f2f2f2; z-index: 301; position: absolute;';

const headItemStyle = 'cursor: pointer; border-top: 1px solid #ccc;' +
                      ' border-right: 1px solid #ccc;' +
                      ' border-left: 1px solid #ccc; padding: 3px 5px;' +
                      ' max-width: 25%; margin: 3px 3px 0 3px; text-align: center';

const headContainerStyle = 'display: flex; flex-flow: row; width: 100%;';

const bodyContainerStyle = 'margin: 0 3px 3px 3px; border: 1px solid #ccc';

const emojiStyle = 'margin: 5px 5px; cursor: pointer;';

class EmojiKit {
    constructor(source) {
        this.src = source.getAttribute('src');
        this.width = source.width;
        this.height = source.height;

        this.editors_sels = ['#e_textarea', '#postmessage', '#fastpostmessage'];
    }

    insertElement(editor) {
        let r = editor.contentWindow.getSelection().getRangeAt(0);
        r.deleteContents();

        let emoji = editor.contentDocument.createElement('img');
        emoji.src = this.src;
        emoji.width = this.width;
        emoji.height = this.height;

        r.insertNode(emoji);
        r.collapse();
        editor.contentDocument.body.focus();
    }

    insertText(editor) {
        var end;
        let val = editor.value;
        const start = val.slice(0, editor.selectionStart);
        if (editor.selectionEnd == 0) {
            end = val.slice();
        } else {
            end = val.slice(editor.selectionEnd, -1);
        }

        const emoji = `[img=${this.width},${this.height}]${this.src}[/img]`;
        const new_val = start + emoji + end;
        const index = start.length + emoji.length;

        editor.value = new_val;
        editor.setSelectionRange(index, index);
        editor.focus();
    }

    findEditor() {
        var type;
        let editor = document.querySelector('#e_iframe');
        if (editor) {
            // visible and active
            if (editor.style.display == '') {
                type = 'wysiwyg';
                return { type, editor };
            }
        }

        for (let sel of this.editors_sels) {
            editor = document.querySelector(sel);
            if (editor) {
                type = 'textarea';
                return { type, editor };
            }
        }

        return {};
    }

    run() {
        let { type, editor } = this.findEditor();

        switch (type) {
            case 'textarea':
                this.insertText(editor);
                break;
            case 'wysiwyg':
                this.insertElement(editor);
                break;
            default:
                throw 'Wrong type of editor';
        }
    }
}

class ExtraEmojisPreviewer {
    constructor(extemojis) {
        this.extemojis = extemojis;
        this.activeSet = Object.keys(extemojis)[0];
        this.sets = {};
        this.build();
    }

    buildHeaderItem(header, set) {
        let li = document.createElement('li');
        li.style = headItemStyle;
        li.innerText = set;

        if (set == this.activeSet) {
            li.style.fontWeight = 'bold';
            this.active = li;
        }

        li.addEventListener('click', this.toggleSet.bind(this), false);
        header.appendChild(li);
    }

    buildSetPage(body, set) {
        let page = document.createElement('div');
        for (let emoji of this.extemojis[set]) {
            let img = document.createElement('img');
            img.src = emoji.src;
            img.width = emoji.width;
            img.height = emoji.height;
            img.style = emojiStyle;

            img.addEventListener('click', this.insertEmoji, false);

            page.appendChild(img);
        }

        if (set != this.activeSet) {
            page.style.display = 'none';
        }

        this.sets[set] = page;

        body.appendChild(page);
    }

    buildContent(div) {
        let header = document.createElement('ul');
        header.style = headContainerStyle;
        let body = document.createElement('div');
        body.style = bodyContainerStyle;
        for (let set in this.extemojis) {
            this.buildHeaderItem(header, set);
            this.buildSetPage(body, set);
        }
        div.appendChild(header);
        div.appendChild(body);
    }

    build() {
        let div = document.createElement('div');
        div.setAttribute('id', 'bbuh_emojis_preview');
        div.style = containerStyle;
        this.buildContent(div);

        div.addEventListener('mouseleave', this.hide.bind(this), false);

        const append_parent = document.querySelector('#append_parent');
        this.node = div;
        append_parent.appendChild(div);
    }

    insertEmoji(event) {
        new EmojiKit(event.target).run();
    }

    toggleSet(event) {
        let set = event.target.innerText;
        // hide and show page
        this.sets[this.activeSet].style.display = 'none';
        this.sets[set].style.display = 'block';

        // make active tab bold
        this.active.style.fontWeight = 'normal';
        this.active = event.target;
        this.active.style.fontWeight = 'bold';

        // set active set
        this.activeSet = set;
    }

    // eslint-disable-next-line no-unused-vars
    hide(event) {
        setTimeout(() => this.node.style.display = 'none', 300);
    }

    show({left, top}) {
        this.node.style.left = `${left}px`;
        this.node.style.top = `${top}px`;
        this.node.style.display = 'block';
    }
}

export default class ExtraEmojis {
    constructor(data) {
        this.extemojis = data.extemojis;
        this.button_url = chrome.runtime.getURL('icons/icon48x48.png');
    }

    showExtraEmoji(event) {
        const origin = { left: event.pageX, top: event.pageY };
        if (!this.previewer) {
            this.previewer = new ExtraEmojisPreviewer(this.extemojis);
        }
        this.previewer.show(origin);
        return false;
    }

    buildButton() {
        let a =  document.createElement('a');
        a.style = buttonStyle;

        let img = document.createElement('img');
        img.setAttribute('src', this.button_url);
        img.setAttribute('width', '24');
        img.setAttribute('height', '24');
        img.style = buttonImgStyle;

        a.addEventListener('click', this.showExtraEmoji.bind(this), false);
        a.appendChild(img);
        return a;
    }

    insertButton(sel) {
        const toolsNode = document.querySelector(sel);
        if (toolsNode) {
            let button = this.buildButton();
            toolsNode.appendChild(button);
        }
    }

    isPostEditor(node) {
        return node.nodeName.toLowerCase() == 'div' &&
            node.hasAttribute('id') &&
            node.getAttribute('id') == 'e_body';
    }

    isFastPostEditor(node) {
        return node.nodeName.toLowerCase() == 'div' &&
            node.hasAttribute('id') &&
            node.getAttribute('id') == 'fastposteditor';
    }

    isFloatLayoutReply(node) {
        return node.nodeName.toLowerCase() == 'form' &&
            node.hasAttribute('id') &&
            node.getAttribute('id') == 'postform';
    }

    run(node) {
        if (this.isPostEditor(node)) {
            this.insertButton('#e_button');
        }

        if (this.isFastPostEditor(node)) {
            this.insertButton('#fastposteditor > div > div.bar');
        }

        if (this.isFloatLayoutReply(node)) {
            this.insertButton('#floatlayout_reply > div > div.tedt > div.bar');
        }
    }
}
