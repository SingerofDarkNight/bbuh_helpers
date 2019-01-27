import storage from '../base/storage.js';
import fixture from '../data/fixture.json';

// eslint-disable-next-line no-unused-vars
export default async function installFixtureHandler(details) {
    const items = await storage.get('profiles', 'blacklist', 'misc', 'settings');
    if (Object.keys(items).length == 0) {
        await storage.seed(fixture);
    }
}
