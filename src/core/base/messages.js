class Messages {
    constructor(source) {
        this.source = source;
    }

    async currentTab() {
        const tabs = await this.source.query({ active: true, currentWindow: true});

        return tabs[0];
    }

    async send(type) {
        try {
            const tab = await this.currentTab();
            const response = await this.source.sendMessage(tab.id, {"type": type });

            return response;
        } catch (e) {
            return null;
        }
    }

    async refresh(tab) {
        if (!tab) {
            tab = await this.currentTab();
        }
        await this.source.reload(tab.id);
    }
}

export default new Messages(chrome.tabs);
