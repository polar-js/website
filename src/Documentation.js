const API = require('./API.js');

class Documentation {
    constructor() {
        this.api = new API();
    }

    async init() {
        const versions = await this.api.getVersions();
        const latest = this.api.getLatest(versions);

        document.getElementById('search').addEventListener('keyup', () => this.search());

        const verSelect = document.getElementById('version');
        verSelect.addEventListener('change', () => this.versionChanged(), false);
        versions.forEach(v => {
            const option = document.createElement('option');
            option.innerText = v;
            if (v === latest) option.setAttribute('selected', 'selected');
            verSelect.appendChild(option);
        });

        const doc = await this.api.getDoc(latest);
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
                li.onclick = () => this.showClass(c);
                li.innerText = c.name;
                ul.appendChild(li);
            });
    }

    showClass(data) {
        const h1 = document.createElement('h1');
    }

    search(value = document.getElementById('search').value) {
        document.querySelector('.main').innerText = 'Searching for ' + value;
    }

    async versionChanged() {
        const verSelect = document.getElementById('version');
        const option = verSelect.options[verSelect.selectedIndex].value;
        const doc = await this.api.getDoc(option);
        this.showDoc(doc);
    }
}

module.exports = Documentation;