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
        this.version('5.3.1');
    }

    scrollTo(view) {
        window.scroll({
            top: view === 'docs' ? window.innerHeight : 0,
            left: 0,
            behavior: 'smooth'
          });
    }

    async version(version) {
        const doc = await this.docs.getDoc(version);

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
    }

    class(data) {
        console.log('opening doc vesion w class', data.params.version)
    }
}

const views = new ViewsManager()
