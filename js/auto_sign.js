(function () {
    function isSigned() {
        let el = document.querySelector('#ct > div.mn > h1.mt');
        if (el && el.innerText == "您今天已经签到过了或者签到时间还未开始") {
            return true;
        }
        return false;
    }

    function randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function selectRandomEmoji() {
        let emojis = document.querySelectorAll('ul.qdsmile > li');
        let selected_emoji = emojis[randomInt(emojis.length)];
        selected_emoji.click();
    }

    function selectRandomMode() {
        let modes = document.querySelectorAll('input[name^=qdmode]');
        let selected_mode = randomInt(modes.length);
        modes[selected_mode].click();
        return selected_mode;
    }

    function handleMode(mode) {
        switch (mode) {
            case 0:
                let todaysay = document.getElementById('todaysay');
                todaysay.value = 'Quick Sign';
                break;
            case 1:
                let fastreply = document.querySelector('select[name=fastreply]');
                fastreply.selectedIndex = randomInt(fastreply.length);
                break;
            default:
                throw 'Invalid Mode';
        }
    }

    function quickSign() {
        if (isSigned()) {
            return;
        }
        selectRandomEmoji();
        try {
            let mode = selectRandomMode();
            handleMode(mode);
        } catch(e) {
            console.log(e);
        }

        let form = document.getElementById('qiandao');
        form.submit();
    }

    // TODO: add settings to disable this
    function init() {
        quickSign();
    }

    init();
})();