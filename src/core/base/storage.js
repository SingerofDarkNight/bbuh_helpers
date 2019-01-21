class StorageWrapper {
    constructor(source) {
        this.source = source;
        this.cached = {};
    }

    async get(...args) {
        // return cached first
        let items = this._getCached(args);

        // retrieve from storage
        if (!items) {
            items = await this.source.get(args);

            for (let k in items) {
                this.cached[k] = items[k];
            }
        }

        // unwrap when accessing a single entry
        if (args.length == 1) {
            return items[args[0]];
        }

        return items;
    }

    _getCached(args) {
        let result = {};
        for (let k of args) {
            if (!(k in this.cached)) return null;
            result[k] = this.cached[k];
        }

        return result;
    }

    async save(key, val) {
        let items = {};
        items[key] = val;
        await this.source.set(items);
        this.cached[key] = val;
    }
}

export default new StorageWrapper(chrome.storage.local);

