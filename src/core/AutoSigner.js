export default class AutoSigner {
    constructor(todaysay) {
        this.todaysay = todaysay || 'QuickSign';

        this.id_sel = '#ct > div.mn > h1.mt';
        this.id_regexp = /您今天已经签到过了或者签到时间还未开始/;

        this.qdsmiles_sel = 'ul.qdsmile > li';
        this.qdmodes_sel = 'input[name^=qdmode]';

        this.todaysay_sel = '#todaysay';
        this.fastreply_sel = 'select[name=fastreply]';

        this.submit_sel = '#qiandao';
    }

    run() {
        if (this.isSigned()) return;

        try {
            this.selectRandomEmotion();
            this.inputMood();
            const form = document.querySelector(this.submit_sel);
            form.submit();
        } catch (e) {
            console.log(e);
        }
    }

    isSigned() {
        const el = document.querySelector(this.id_sel);
        if (el && el.innerText.match(this.id_regexp)) {
            return true;
        }

        return false;
    }

    selectRandomEmotion() {
        const emotions = document.querySelectorAll(this.qdsmiles_sel);
        const selected_emotion = emotions[this.randomInt(emotions.length)];
        selected_emotion.click();
    }

    inputMood() {
        const modes = document.querySelectorAll(this.qdmodes_sel);
        const selected_mode = this.randomInt(modes.length);
        modes[selected_mode].click();

        switch (selected_mode) {
            case 0:
                let todaysay = document.querySelector(this.todaysay_sel);
                todaysay.value = this.todaysay;
                break;
            case 1:
                let fastreply = document.querySelector(this.fastreply_sel);
                fastreply.selectedIndex = this.randomInt(fastreply.length);
                break;
            default:
                throw 'Invalid mode';
        }
    }

    randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
