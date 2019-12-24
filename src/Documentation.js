const API = require('./API.js');
const Location = require('./Location.js');

class Documentation {
    constructor() {
        this.api = new API();
        window.onhashchange = () => this.init();
    }

    async init() {

        Location.init();
        if (Location.getPage() !== 'docs') {
            Location.setPage('docs');
            this.showHome();
        }

        const versions = await this.api.getVersions();

        let selected = Location.getVersion();
        if (!selected) {
            selected = this.api.getLatest(versions);
            Location.setVersion(selected);
        }

        document.getElementById('search').addEventListener('keyup', () => this.search());

        const verSelect = document.getElementById('version');
        verSelect.innerHTML = '';
        verSelect.addEventListener('change', () => this.versionChanged(), false);
        versions.forEach(version => {
            const option = document.createElement('option');
            option.innerText = version;
            if (version === selected) option.setAttribute('selected', 'selected');
            verSelect.appendChild(option);
        });

        const doc = await this.api.getDoc(selected);
        this.showDoc(doc);

        if (Location.getHeading() == 'class') {
            const selected = Location.getSelected();
            if (selected) {
                const names = doc.classes.map(c => c.name);
                if (names.includes(selected)) {
                    this.showClass(doc.classes[names.indexOf(selected)]);
                    return;
                }
                else {
                    Location.truncateItems(2);
                }
            }
        }
        this.showHome();
    }

    showDoc(doc) {
        const ul = document.getElementById('classes');
        this.removeChildren(ul);
        
        this.createList(doc.classes, c => {
            Location.setHeading('class');
            Location.setSelected(c.name);
        }, ul);
    }

    showClass(data) {
        Location.setHeading('class');
        Location.setSelected(data.name);

        const main = document.querySelector('.main');
        this.removeChildren(main);

        const titleDiv = document.createElement('div');
        main.appendChild(titleDiv);

        const title = document.createElement('h1');
        title.innerText = data.name;
        title.classList.add('inline-block');
        titleDiv.appendChild(title);

        // TODO: Whether a class 'extends' another class.
        // if (data.flags.extends) {
        //     const extendsLabel = document.createElement('span');
        //     extendsLabel.innerText = `extends ${data.flags.extends}`;
        //     titleDiv.appendChild(extendsLabel);
        // }

        if (data.flags.abstract) {
            const abstractLabel = document.createElement('span');
            abstractLabel.innerText = 'abstract';
            abstractLabel.classList.add('attribute');
            abstractLabel.classList.add('abstract');
            titleDiv.appendChild(abstractLabel);
        }

        const classDescription = document.createElement('p');
        classDescription.innerText = data.description;
        main.appendChild(classDescription);

        if (data.parameters != null) {
            const constructorTitle = document.createElement('h2');
            constructorTitle.innerText = 'Constructor';
            main.appendChild(constructorTitle);

            const examplePre = document.createElement('pre');
            const exampleCode = document.createElement('code');
            exampleCode.classList.add('prettyprint');
            exampleCode.classList.add('lang-js');
            if (data.parameters.length > 2)
                exampleCode.innerHTML = `new Polar.${data.name}(${data.parameters.map(p => p.name).join(',\n    ')}\n);`;
            else 
                exampleCode.innerHTML = `new Polar.${data.name}(${data.parameters.map(p => p.name).join(', ')});`;
            examplePre.appendChild(exampleCode);
            main.appendChild(examplePre);
            
            if (data.parameters.length > 0) {
                const table = document.createElement('table');
                table.classList.add('parameter-table');
                const headerRow = document.createElement('tr');
                const headings = ['Parameter', 'Type', 'Optional', 'Default', 'Description'];
                for (let heading of headings) {
                    const th = document.createElement('th');
                    th.innerText = heading;
                    headerRow.appendChild(th);
                }
                table.appendChild(headerRow);
                
                for (let parameter of data.parameters) {
                    const row = document.createElement('tr');
                    for (let heading of headings) {
                        const td = document.createElement('td');
                        switch (heading) {
                        case 'Parameter': td.innerText = parameter.name || ''; break;
                        case 'Type': td.innerText = parameter.type || ''; break;
                        case 'Optional': td.innerText = 'TODO'; break;
                        case 'Default': td.innerText = 'TODO'; break;
                        case 'Description': td.innerText = parameter.description || ''; break;
                        }
                        row.appendChild(td);
                    }
                    table.appendChild(row);
                }
                main.appendChild(table);
            }
        }
        
        if (data.methods) {
            const methods = data.methods.filter(m => {
                return !m.flags.private;
            });

            if (methods.length > 0) {
                const methodTitle = document.createElement('h2');
                methodTitle.innerText = 'Methods';
                main.appendChild(methodTitle);

                for (let method of methods) {
                    const methodDiv = document.createElement('div');

                    if (method.flags.static) {
                        const staticLabel = document.createElement('span');
                        staticLabel.innerText = 'static';
                        staticLabel.classList.add('attribute');
                        staticLabel.classList.add('static');
                        methodDiv.appendChild(staticLabel);
                    }

                    if (method.flags.abstract) {
                        const staticLabel = document.createElement('span');
                        staticLabel.innerText = 'abstract';
                        staticLabel.classList.add('attribute');
                        staticLabel.classList.add('abstract');
                        methodDiv.appendChild(staticLabel);
                    }

                    const methodText = document.createElement('h3');
                    methodText.innerText = `.${method.name}(<TODO: PARAMETERS>): ${method.returns.name}`;
                    methodText.classList.add('inline-block');
                    methodDiv.appendChild(methodText);

                    const methodDesc = document.createElement('p');
                    methodDesc.innerText = method.description;
                    methodDiv.appendChild(methodDesc);

                    main.appendChild(methodDiv);
                }
            }
        }

        if (data.properties) {
            const properties = data.properties.filter(p => {
                return !p.flags.private;
            });

            if (properties.length > 0) {
                const PropertyTitle = document.createElement('h2');
                PropertyTitle.innerText = 'Properties';
                main.appendChild(PropertyTitle);
                
                for (let property of properties) {
                    
                    const propertyDiv = document.createElement('div');
                    
                    const propertyName = document.createElement('h3');
                    propertyName.innerText = '.' + property.name;
                    propertyDiv.appendChild(propertyName);
    
                    if (property.flags.static) {
                        const staticLabel = document.createElement('span');
                        staticLabel.innerText = 'static';
                        propertyDiv.appendChild(staticLabel);
                    }
                    
                    const typeTitle = document.createElement('b');
                    typeTitle.innerText = 'Type: ';
                    propertyDiv.appendChild(typeTitle);
                    
                    const type = document.createElement('i');
                    type.innerText = property.type;
                    propertyDiv.appendChild(type);
                    
                    const propertyDesc = document.createElement('p');
                    propertyDesc.innerText = property.description;
                    propertyDiv.appendChild(propertyDesc);
    
                    main.appendChild(propertyDiv);
                }
            }
        }
    }

    showHome() {
        const main = document.querySelector('.main');
        main.innerHTML = 
`<h1>Polar Documentation</h1>
<h2>Prerequisites</h2>
<p>To develop with Polar, we recommended that you have:</p>
<ul>
    <li>experience with Javascript or TypeScript</li>
    <li>knowledge of object oriented programming techniques such inheritance and polymorphism.</li>
</ul>
<p>Thats it! Polar is designed to be easy to pick up, including plenty of technical features for the more enthusiastic users.</p>
<h2>Project Setup</h2>
<p>This section will discuss how to setup and use Polar with Javascript.</p>
<ol>
<li>Visit the <a href='https://github.com/polar-js/polar.js'>github repository</a> and download the latest release of polar.js.</li>
<li>Place the polar.X.X.X.js file in your project directory.</li>
<li>Include the script at the end of the body of your HTML file.</li>
<pre><code class="prettyprint"
>&lt;html&gt;
    ...
    &lt;body&gt;
        ...
        &lt;script src=&quot;/polar.1.0.0.js&quot;&gt;&lt;/script&gt;
        &lt;script src=&quot;/my-game.js&quot;&gt;&lt;/script&gt;
    &lt;/body&gt;
&lt;/html&gt;
</code></pre>
<li>Add a canvas above the script with a specific ID.</li>
<pre><code class="prettyprint"
>&lt;html&gt;
    ...
    &lt;body&gt;
        ...
        &lt;canvas id=&quot;game-canvas&quot;&gt;&lt;/canvas&gt;
        ...
        &lt;script src=&quot;/polar.1.0.0.js&quot;&gt;&lt;/script&gt;
        &lt;script src=&quot;/my-game.js&quot;&gt;&lt;/script&gt;
    &lt;/body&gt;
&lt;/html&gt;
</code></pre>
</ol>
<h2>JavaScript Programming Guide</h2>
<p>To start the engine, call <code class="prettyprint">Polar.begin(...)</code>. This function inputs an instance of a subclass of <code class="prettyprint">Polar.Application</code>.
The application inputs a <code class="prettyprint">Polar.ApplicationSettings</code> instance where values such as <i>canvasID</i> and <i>displayMode</i> are specified.
</p>
<pre><code class="prettyprint"
>// my-game.js
class Sandbox extends Polar.Application {
	constructor(settings) {
		super(settings);
                console.log(&apos;Created application!&apos;);
	}
}

Polar.begin(new Sandbox({ canvasID: &apos;game-canvas&apos;, displayMode: &apos;fill&apos; }));
</pre></code>
`;

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
        Location.setVersion(option);
        const doc = await this.api.getDoc(option);
        this.showDoc(doc);
    }
}

module.exports = Documentation;