class Documentation {
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
            const versions =  ['1.1.1', '2.4.2', '5.3.1']
            // TEMP ^
            localStorage.setItem('last_refresh', now);
            localStorage.setItem('versions', JSON.stringify(versions));
            return versions;
        };
        return JSON.parse(localStorage.getItem('versions'));
    };
    
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
        this.docs = new Documentation();
    }

    async init() {
        const versions = await this.docs.getVersions();
        const latest = this.docs.getLatest(versions);

        const verSelect = document.getElementById('version');
        verSelect.addEventListener('change', () => this.versionChanged(), false);
        versions.forEach(v => {
            const option = document.createElement('option');
            option.innerText = v;
            if (v === latest) option.setAttribute('selected', 'selected');
            verSelect.appendChild(option);
        })

        const doc = await this.docs.getDoc(latest);
        this.showDoc(doc);    
    }

    scrollTo(view) {
        window.scroll({
            top: view === 'docs' ? window.innerHeight * 1.01 : 0,
            left: 0,
            behavior: 'smooth'
          });
    }

    async versionChanged() {
        const verSelect = document.getElementById('version');
        const option = verSelect.options[verSelect.selectedIndex].value;
        const doc = await this.docs.getDoc(option);
        this.showDoc(doc);
    }

    showDoc(doc) {
        const ul = document.getElementById('classes');
        while (ul.firstChild) {
            ul.firstChild.remove();
        }
        
        doc.children
            .filter(c => c.kindString === 'Class')
            .forEach(c => {
                const li = document.createElement('li');
                li.onclick = () => document.getElementById('doctext').innerText = JSON.stringify(c);
                li.innerText = c.name;
                ul.appendChild(li);
            })
    }

    arrowClick() {
        console.log('TODO')
        console.log('If header in view, go down. If no header in view, go to docs');
        console.log('Also should rotate to match these ^^^^');
    }
}

const views = new ViewsManager()
views.init();