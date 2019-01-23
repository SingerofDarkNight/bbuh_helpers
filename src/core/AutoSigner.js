export default class AutoSigner {
    constructor(todaysay) {
        this.todaysay = todaysay || 'QuickSign';
    }

    isSigned() {
        const el = document.querySelector('#ct > div.mn > h1.mt');
        if (el && el.innerText.match(/您今天已经签到过了或者签到时间还未开始/)) {
            return true;
        }

        return false;
    }

    randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    selectRandomEmotion() {
        const emotions = document.querySelectorAll('ul.qdsmile > li');
        const selected_emotion = emotions[this.randomInt(emotions.length)];
        selected_emotion.click();
    }

    inputMood() {
        const modes = document.querySelectorAll('input[name^=qdmode]');
        const selected_mode = this.randomInt(modes.length);
        modes[selected_mode].click();

        switch (selected_mode) {
            case 0:
                let todaysay = document.querySelector('#todaysay');
                todaysay.value = this.todaysay;
                break;
            case 1:
                let fastreply = document.querySelector('select[name=fastreply]');
                fastreply.selectedIndex = this.randomInt(fastreply.length);
                break;
            default:
                throw 'Invalid mode';
        }
    }

    run() {
        if (this.isSigned()) return;

        try {
            this.selectRandomEmotion();
            this.inputMood();
            const form = document.querySelector('#qiandao');
            form.submit();
        } catch (e) {
            console.log(e);
        }
    }
}
