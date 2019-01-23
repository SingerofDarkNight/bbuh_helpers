export class BlockThreadByBlacklist {
    constructor(data) {
        this.blacklist = data.blacklist;
    }

    isThread(node) {
        return node.nodeName.toLowerCase() == 'tbody' &&
            node.hasAttribute('id') &&
            node.getAttribute('id').match(/(stickthread|normalthread)(\_\d+)/);
    }

    blockByAuthor(author, node) {
        if (this.blacklist[author] &&
            (this.blacklist[author] == 'user' || this.blacklist[author] == 'both')) {
            node.style.display = 'none';
        }
    }

    blockByKeyword(post_title, node) {
        for (let kw in this.blacklist) {
            if (this.blacklist[kw] == 'keyword' && post_title.indexOf(kw) >= 0) {
                node.style.display = 'none';
                break;
            }
        }
    }

    run(node) {
        if (!this.isThread(node)) return;

        const post_el = node.querySelector('.s.xst');
        const author_el = node.querySelectorAll('.by > cite > a')[0];

        if (!post_el || !author_el) return;

        const post_title = post_el.innerText;
        const author = author_el.innerText;

        this.blockByAuthor(author, node);
        this.blockByKeyword(post_title, node);
    }
}

export class BlockReplyByBlacklist {
    constructor(data) {
        this.blacklist = data.blacklist;
    }

    isPost(node) {
        return node.nodeName.toLowerCase() == 'div' &&
            node.hasAttribute('id') &&
            node.getAttribute('id').match(/post\_\d+/);
    }

    run(node) {
        if (!this.isPost(node)) return;

        const user = node.querySelector('div.pls.favatar > div.pi > div > a').innerText;

        if (this.blacklist[user] &&
            (this.blacklist[user] == 'user' || this.blacklist[user] == 'both')) {
            node.style.display = 'none';
        }
    }
}

export class BlockReplyByUserGroups {
    constructor(data) {
        this.forbidden_groups = data.misc.user_levels.slice(0, data.misc.min_level);
        this.main_post_label = data.settings.main_post_label;
    }

    isPost(node) {
        return node.nodeName.toLowerCase() == 'div' &&
            node.hasAttribute('id') &&
            node.getAttribute('id').match(/post\_\d+/);
    }

    run(node) {
        if (!this.isPost(node)) return;

        const gid_el = node.querySelector('div.pls.favatar > p:nth-child(5) > a');
        if (!gid_el) return;

        const gid = Number(gid_el.getAttribute('href').slice(38));
        const postnum = node.querySelector('a[id^=postnum]').innerText;

        if (postnum != this.main_post_label &&
            this.forbidden_groups.indexOf(gid) > 0) {
            node.style.display = 'none';
        }
    }
}

export class BlockMedals {
    run(node) {
        if (node.nodeName.toLowerCase() == 'p' &&
            node.hasAttribute('class') &&
            node.getAttribute('class') == 'md_ctrl') {
            node.style.display = 'none';
        }
    }
}

export class BlockSigns {
    run(node) {
        if (node.nodeName.toLowerCase() == 'div' &&
            node.hasAttribute('class') &&
            node.getAttribute('class') == 'sign') {
            node.style.display = 'none';
        }
    }
}

export class ForumModifier {
    constructor(operations, data, observeOpts) {
        this.operations = [];
        for (let op of operations) {
            this.operations.push(new op(data));
        }
        this.observeOpts = observeOpts || { childList: true, subtree: true };
    }

    observerCallback(mutationList, observer) {
        const operations = this.operations;

        mutationList.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function (node) {
                    for (let op of operations) {
                        op.run(node);
                    }
                });
            }
        });
    }

    run() {
        const ob = new MutationObserver(this.observerCallback.bind(this));
        ob.observe(document, this.observeOpts);
    }
}
