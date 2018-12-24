(function () {
    function hideMedals(node) {
        if (node.nodeName.toLowerCase() == 'p' &&
            node.hasAttribute('class') &&
            node.getAttribute('class') == 'md_ctrl') {
            node.style.display = 'none';
        }
    }

    function hideSigns(node) {
        if (node.nodeName.toLowerCase() == 'div' &&
            node.hasAttribute('class') &&
            node.getAttribute('class') == 'sign') {
            node.style.display = 'none';
        }
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

    function hideUserGroups(node, misc, settings) {
        if (node.nodeName.toLowerCase() == 'a' &&
            node.hasAttribute('href')) {
            let href = node.getAttribute('href');
            if (href.indexOf('home.php?mod=spacecp&ac=usergroup&gid') == 0) {
                // get post element
                let post_el = getAncestorElement(node, 7);
                if (post_el && post_el.id.match(/post\_/)) {
                    // get thread number
                    let el_id = 'postnum' + post_el.id.match(/\d+/)[0];
                    let t = document.getElementById(el_id).innerText;
                    // forbidden groups
                    let ag = settings.user_levels.slice(0, misc.min_level);
                    // get group id
                    let gid = Number(href.slice(38));
                    if (t != settings.main_post_label &&
                        ag.indexOf(gid) >= 0) {
                        post_el.style.display = 'none';
                    }
                }
            }
        }
    }

    function initObserver(misc, settings) {
        let ob = new MutationObserver(function (mutationList, observer) {
            mutationList.forEach(function (mutation) {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(function (node) {
                        if (misc.hide_replies) {
                            hideUserGroups(node, misc, settings);
                        }

                        if (misc.hide_medals) {
                            hideMedals(node);
                        }

                        if (misc.hide_signs) {
                            hideSigns(node);
                        }
                    });
                }
            });
        });

        return ob;
    }

    function init() {
        chrome.storage.local.get(['misc', 'settings'], function (items) {
            let ob = initObserver(items.misc, items.settings);
            ob.observe(document, {childList: true, subtree: true});
        });
    }

    init();
})();
