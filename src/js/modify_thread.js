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

    function hideByGroup(node, misc, settings) {
        if (misc.hide_replies) {
            let gid_el = node.querySelector('div.pls.favatar > p:nth-child(5) > a');
            if (!gid_el) {
                return false;
            }
            let gid = Number(gid_el.getAttribute('href').slice(38));
            let postnum = node.querySelector('a[id^=postnum]').innerText;
            let forbidden_groups = settings.user_levels.slice(0, misc.min_level);
            if (postnum != settings.main_post_label &&
                forbidden_groups.indexOf(gid) > 0) {
                node.style.display = 'none';
            }
        }
    }

    function hideByBlacklist(node, blacklist, settings) {
        if (settings.enable_blacklist) {
            let user = node.querySelector('div.pls.favatar > div.pi > div > a').innerText;
            if (blacklist[user] &&
                (blacklist[user] == 'user' || blacklist[user] == 'both')) {
                node.style.display = 'none';
            }
        }
    }

    function hideUserContent(node, misc, blacklist, settings) {
        if (node.nodeName.toLowerCase() == 'div' &&
            node.hasAttribute('id') &&
            node.getAttribute('id').match(/post\_\d+/)) {
            hideByBlacklist(node, blacklist, settings);
            hideByGroup(node, misc, settings);
        }
    }

    function initObserver(misc, blacklist, settings) {
        let ob = new MutationObserver(function (mutationList, observer) {
            mutationList.forEach(function (mutation) {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(function (node) {
                        hideUserContent(node, misc, blacklist, settings);

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
        chrome.storage.local.get(['misc', 'settings', 'blacklist'], function (items) {
            let ob = initObserver(items.misc, items.blacklist, items.settings);
            ob.observe(document, {childList: true, subtree: true});
        });
    }

    init();
})();
