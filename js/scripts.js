class API {
    constructor() {
        this.GITHUB_CONTENT = 'https://raw.githubusercontent.com';
        this.GITHUB_API = 'https://api.github.com';
        this.versions = this.getVersions();
    }
    async getVersions() {
        const content = await fetch(this.GITHUB_API + '/repos/JellyAlex/polar.js/contents?ref=docs');
        const json = await content.json();
        // return ['1.1.1', '2.4.2', '5.3.1']
        return json.map(file => file.name.replace('.json', ''));
    };
    
    async getDoc(version) {
        if (localStorage.has(version)) return localStorage.get(version);
        const content = await fetch(this.GITHUB_CONTENT + `/JellyAlex/polar.js/docs/${version}.json`);
        const json = await content.json();
        localStorage.setItem(version, json);
        return json;
    }

    async getLatest() {
        const versions = await this.versions;
        let parsed = versions.map(ver => ver.split('.').map(v => parseInt(v)))
        let index = 0;
        while (parsed.length > 1) {
            parsed = parsed.filter((ver, _, arr) => ver[index] === Math.max(...arr.map(v => v[index])))
            index++;
        }
        return parsed[0].join('.');
    }
}

const api = new API();

page('/docs/stable', async () => page.redirect(`/docs/${await api.getLatest()}`));
page('/docs/:version', (data) => console.log('opening doc vesion', data.params.version));
page('/docs/:version/:class', (data) => console.log('opening doc vesion w class', data.params.version));
page.start();
