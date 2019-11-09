class API {
    constructor() {
        this.GITHUB_CONTENT = 'https://raw.githubusercontent.com';
        this.GITHUB_API = 'https://api.github.com';
    }

    async getVersions() {
        const now = new Date().getTime();
        const lastRefresh = parseInt(localStorage.getItem('last_refresh') || 0);
        if (lastRefresh + 3.6e+6 < now) {
            /*
            const content = await fetch(this.GITHUB_API + '/repos/JellyAlex/polar.js/contents?ref=docs');
            const json = await content.json();
            const versions = json.map(file => file.name.replace('.json', ''));
            */
            const versions =  ['1.1.1', '2.4.2', '5.3.1'];
            // TEMP ^
            localStorage.setItem('last_refresh', now);
            localStorage.setItem('versions', JSON.stringify(versions));
            return versions;
        }
        return JSON.parse(localStorage.getItem('versions'));
    }
    
    async getDoc(version) {
        const docs = JSON.parse(localStorage.getItem('docs') || '{}');
        if (!docs[version]) {
            /*
            const content = await fetch(this.GITHUB_CONTENT + `/JellyAlex/polar.js/docs/${version}.json`);
            docs[version] = await content.json();
            */
            const content = await fetch('/static/tempdocs.json');
            docs[version] = await content.json();
            // TEMP ^
            localStorage.setItem('docs', JSON.stringify(docs));
            return docs[version];
        }
        return docs[version];
    }

    getLatest(versions) {
        let parsed = versions.map(ver => ver.split('.').map(v => parseInt(v)));
        let index = 0;
        while (parsed.length > 1) {
            parsed = parsed.filter((ver, _, arr) => ver[index] === Math.max(...arr.map(v => v[index])));
            index++;
        }
        return parsed[0].join('.');
    }
}

module.exports = API;