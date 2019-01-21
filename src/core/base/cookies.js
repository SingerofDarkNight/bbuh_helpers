import { bbuh_domain, bbuh_site_url } from './consts.js';

class Cookies {
    constructor(source) {
        this.source = source;
    }

    async getAll() {
        return this.source.getAll({ domain: bbuh_domain });
    }

    async removeAll(vals) {
        if (vals == null) {
            vals = await this.getAll();
        }

        for (let c of vals) {
            await this.source.remove({ url: bbuh_site_url, name: c.name });
        }
    }

    async setAll(vals) {
        for (let c of vals) {
            let data = { url: bbuh_site_url };
            for (let k in c) {
                if (k != 'session' & k != 'hostOnly') {
                    data[k] = c[k];
                }
            }

            await this.source.set(data);
        }
    }
}

export default new Cookies(chrome.cookies);
