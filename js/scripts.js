class Documentation {
    constructor() {
        this.GITHUB_CONTENT = 'https://raw.githubusercontent.com';
        this.GITHUB_API = 'https://api.github.com';
        this.versions = this.getVersions();
    }

    async getVersions() {
        /*
        const content = await fetch(this.GITHUB_API + '/repos/JellyAlex/polar.js/contents?ref=docs');
        const json = await content.json();
        return json.map(file => file.name.replace('.json', ''));
        */
        return ['1.1.1', '2.4.2', '5.3.1']
    };
    
    async getDoc(version) {
        const ver = JSON.parse(localStorage.getItem(version));
        if (ver) return ver;
        /*
        const content = await fetch(this.GITHUB_CONTENT + `/JellyAlex/polar.js/docs/${version}.json`);
        const json = await content.json();
        */
        const content = await fetch('/static/tempdocs.json');
        const json = await content.json();
        localStorage.setItem(version, JSON.stringify(json));
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

class ViewsManager {
    constructor() {
        this.docs = new Documentation()

        page('/', () => this.home());
        page('/docs/stable', () => this.stable());
        page('/docs/:version', d => this.version(d));
        page('/docs/:version/:class', d => this.class(d));
        page.start();
    }

    home() {
        this.showPage('home');
    }

    async stable() {
        page.redirect(`/docs/${await this.docs.getLatest()}`)
    }

    async version(data) {
        const doc = await this.docs.getDoc(data.params.version);

        const ul = document.getElementById('classes');
        while (ul.firstChild) {
            ul.firstChild.remove();
        }
        
        doc.children
            .filter(c => c.kindString === 'Class')
            .forEach(c => {
                const li = document.createElement('li');
                li.innerText = c.name;
                ul.appendChild(li);
            })

        this.showPage('docs');
    }

    class(data) {
        console.log('opening doc vesion w class', data.params.version)
    }

    showPage(page) {
        ['home', 'docs'].forEach(p => {
            for (let el of document.getElementsByClassName(p)) {
                el.style.display = page === p ? 'block' : 'none'
            }
        });
    }
}

const views = new ViewsManager()
