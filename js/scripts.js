class Documentation {
    constructor() {
        this.GITHUB_CONTENT = 'https://raw.githubusercontent.com';
        this.GITHUB_API = 'https://api.github.com';
        this.versions = this.getVersions();
    }
    async getVersions() {
        //const content = await fetch(this.GITHUB_API + '/repos/JellyAlex/polar.js/contents?ref=docs');
        //const json = await content.json();
        return ['1.1.1', '2.4.2', '5.3.1']
        //return json.map(file => file.name.replace('.json', ''));
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

class Views {
    constructor() {
        page('/docs/stable', this.stable);
        page('/docs/:version', this.version);
        page('/docs/:version/:class', this.class);
        page.start();
    }

    async stable() {
        page.redirect(`/docs/${await api.getLatest()}`)
    }

    async version() {
        document.getElementsByClassName('home')[0].style.display = 'none';
    }

    async class(data) {
        console.log('opening doc vesion w class', data.params.version)
    }

    showPage() {
        const pages = ['home', 'docs'];
    }
}

const views = new Views()
const docs = new Documentation();
