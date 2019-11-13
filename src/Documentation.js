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
        
        this.createList(doc.classes, c => this.showClass(c), ul);
    }

    showClass(data) {
        const main = document.querySelector('.main');
        this.removeChildren(main);

        const title = document.createElement('h1');
        title.innerText = data.name;
        main.appendChild(title);

        const description = document.createElement('h4');
        description.innerText = data.description;
        main.appendChild(description);

        const methodTitle = document.createElement('b');
        methodTitle.innerText = 'Methods';
        const PropertyTitle = document.createElement('b');
        PropertyTitle.innerText = 'Properties';
        
        main.appendChild(methodTitle);
        main.appendChild(this.createList(data.methods, c => console.log(c)));
        main.appendChild(PropertyTitle);
        main.appendChild(this.createList(data.properties, c => console.log(c)));
    }

    createList(list, onClick, ul = document.createElement('ul')) {
        for (const child of list){
            const li = document.createElement('li');
            li.onclick = () => onClick(child);
            li.innerText = child.name;
            ul.appendChild(li);
        }
        return ul;
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