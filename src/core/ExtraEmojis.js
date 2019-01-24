class ExtraEmojisPreviewer {
    constructor(extemojis) {
        this.build(extemojis);
    }

    build() {
    }

    show() {
    }
}

export default class ExtraEmojis {
    constructor(data) {
        this.extemojis = data.extemojis;
        this.button_url = data.settings.extemojis_button;
    }

    showExtraEmoji(event) {
        if (!this.previewer) {
            this.previewer = new ExtraEmojisPreviewer(this.extemojis);
        }
        this.previewer.show();
    }

    buildButton() {
        let a =  document.createElement('a');
        a.style.float = 'right';
        a.style.background = '#f2f2f2';

        let img = document.createElement('img');
        img.setAttribute('src', this.button_url)
        img.setAttribute('width', '24');
        img.setAttribute('height', '24');

        a.addEventListener('click', this.showExtraEmoji.bind(this));
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
