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
        this.removeChildren(ul);
        
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
        const main = document.querySelector('.main');
        this.removeChildren(main);

        const title = document.createElement('h1');
        title.innerText = data.name;
        main.appendChild(title);
    }

    removeChildren(element) {
        while (element.firstChild) {
            element.firstChild.remove();
        }
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