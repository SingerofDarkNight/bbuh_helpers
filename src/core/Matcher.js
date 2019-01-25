export default class Matcher {
    constructor(source) {
        this.url = new URL(source.URL);
    }

    get pathname() {
        return this.url.pathname;
    }

    get search() {
        return this.url.search;
    }

    getSearchParam(name) {
        return this.url.searchParams.get(name);
    }

    get isSignPage() {
        return this.pathname.match(/^\/dsu_paulsign-sign/);
    }

    get isForumPage() {
        return this.pathname.match(/^\/forum(-\d+)+/) ||
            (this.getSearchParam('mod') &&
             this.getSearchParam('mod').match(/forumdisplay/));
    }

    get isThreadPage() {
        return this.pathname.match(/^\/thread(-\d+)+/) ||
            (this.getSearchParam('mod') &&
             this.getSearchParam('mod').match(/viewthread/));
    }

    get isEditorPage() {
        return this.getSearchParam('mod') &&
            this.getSearchParam('mod').match(/post/);
    }

    get containsEditorPage() {
        return this.isThreadPage || this.isForumPage || this.isEditorPage;
    }
}
