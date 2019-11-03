const GITHUB_CONTENT = 'https://raw.githubusercontent.com';
const GITHUB_API = 'https://api.github.com';

page('/index.html', () => console.log('abc'))
page('/docs/:version', (data) => console.log('opening doc vesion', data.params.version));
page('/docs/:version/:class', (data) => console.log('opening doc vesion w class', data.params.version));
page.start();

async function getVersions() {
    const content = await fetch(GITHUB_API + '/repos/JellyAlex/polar.js/contents?ref=docs');
    const json = await content.json();
    return json.map(file => ({ version: file.name.replace('.json', ''), url: file.download_url }));
};

async function getDoc(version) {
    if (localStorage.has(version)) return localStorage.get(version);
    const content = await fetch(GITHUB_CONTENT + `JellyAlex/polar.js/docs/${version}.json`);
    const json = await content.json();
    localStorage.setItem(version, json);
    return json;
}