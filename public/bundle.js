/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/API.js":
/*!********************!*\
  !*** ./src/API.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class API {\r\n    constructor() {\r\n        this.GITHUB_CONTENT = 'https://raw.githubusercontent.com';\r\n        this.GITHUB_API = 'https://api.github.com';\r\n    }\r\n\r\n    async getVersions() {\r\n        const now = new Date().getTime();\r\n        const lastRefresh = parseInt(localStorage.getItem('last_refresh') || 0);\r\n        if (lastRefresh + 3.6e+6 < now) {\r\n            /*\r\n            const content = await fetch(this.GITHUB_API + '/repos/JellyAlex/polar.js/contents?ref=docs');\r\n            const json = await content.json();\r\n            const versions = json.map(file => file.name.replace('.json', ''));\r\n            */\r\n            const versions =  ['1.1.1', '2.4.2', '5.3.1'];\r\n            // TEMP ^\r\n            localStorage.setItem('last_refresh', now);\r\n            localStorage.setItem('versions', JSON.stringify(versions));\r\n            return versions;\r\n        }\r\n        return JSON.parse(localStorage.getItem('versions'));\r\n    }\r\n    \r\n    async getDoc(version) {\r\n        const docs = JSON.parse(localStorage.getItem('docs') || '{}');\r\n        if (!docs[version]) {\r\n            /*\r\n            const content = await fetch(this.GITHUB_CONTENT + `/JellyAlex/polar.js/docs/${version}.json`);\r\n            docs[version] = await content.json();\r\n            */\r\n            const content = await fetch('/static/tempdocs.json');\r\n            docs[version] = await content.json();\r\n            // TEMP ^\r\n            localStorage.setItem('docs', JSON.stringify(docs));\r\n            return docs[version];\r\n        }\r\n        return docs[version];\r\n    }\r\n\r\n    getLatest(versions) {\r\n        let parsed = versions.map(ver => ver.split('.').map(v => parseInt(v)));\r\n        let index = 0;\r\n        while (parsed.length > 1) {\r\n            parsed = parsed.filter((ver, _, arr) => ver[index] === Math.max(...arr.map(v => v[index])));\r\n            index++;\r\n        }\r\n        return parsed[0].join('.');\r\n    }\r\n}\r\n\r\nmodule.exports = API;\n\n//# sourceURL=webpack:///./src/API.js?");

/***/ }),

/***/ "./src/Documentation.js":
/*!******************************!*\
  !*** ./src/Documentation.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const API = __webpack_require__(/*! ./API.js */ \"./src/API.js\");\r\n\r\nclass Documentation {\r\n    constructor() {\r\n        this.api = new API();\r\n    }\r\n\r\n    async init() {\r\n        const versions = await this.api.getVersions();\r\n        const latest = this.api.getLatest(versions);\r\n\r\n        document.getElementById('search').addEventListener('keyup', () => this.search());\r\n\r\n        const verSelect = document.getElementById('version');\r\n        verSelect.addEventListener('change', () => this.versionChanged(), false);\r\n        versions.forEach(v => {\r\n            const option = document.createElement('option');\r\n            option.innerText = v;\r\n            if (v === latest) option.setAttribute('selected', 'selected');\r\n            verSelect.appendChild(option);\r\n        });\r\n\r\n        const doc = await this.api.getDoc(latest);\r\n        this.showDoc(doc);    \r\n    }\r\n\r\n    showDoc(doc) {\r\n        const ul = document.getElementById('classes');\r\n        this.removeChildren(ul);\r\n        \r\n        doc.children\r\n            .filter(c => c.kindString === 'Class')\r\n            .forEach(c => {\r\n                const li = document.createElement('li');\r\n                li.onclick = () => this.showClass(c);\r\n                li.innerText = c.name;\r\n                ul.appendChild(li);\r\n            });\r\n    }\r\n\r\n    showClass(data) {\r\n        const main = document.querySelector('.main');\r\n        this.removeChildren(main);\r\n\r\n        const title = document.createElement('h1');\r\n        title.innerText = data.name;\r\n        main.appendChild(title);\r\n    }\r\n\r\n    removeChildren(element) {\r\n        while (element.firstChild) {\r\n            element.firstChild.remove();\r\n        }\r\n    }\r\n\r\n    search(value = document.getElementById('search').value) {\r\n        document.querySelector('.main').innerText = 'Searching for ' + value;\r\n    }\r\n\r\n    async versionChanged() {\r\n        const verSelect = document.getElementById('version');\r\n        const option = verSelect.options[verSelect.selectedIndex].value;\r\n        const doc = await this.api.getDoc(option);\r\n        this.showDoc(doc);\r\n    }\r\n}\r\n\r\nmodule.exports = Documentation;\n\n//# sourceURL=webpack:///./src/Documentation.js?");

/***/ }),

/***/ "./src/PageArrow.js":
/*!**************************!*\
  !*** ./src/PageArrow.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Util = __webpack_require__(/*! ./Util.js */ \"./src/Util.js\");\r\n\r\nclass PageArrow {\r\n    constructor() {\r\n        this.observer = new IntersectionObserver(\r\n            entries => this.rotateArrow(entries[0].isIntersecting), \r\n            {\r\n                root: null,\r\n                rootMargin: '150px',\r\n                threshold: 1.0\r\n            });\r\n        this.observer.observe(document.querySelector('#header-image'));\r\n    }\r\n\r\n    rotateArrow(inView) {\r\n        const arrow = document.querySelector('.arrow');\r\n        if (inView) {\r\n            arrow.onclick = () => Util.scrollTo('docs');\r\n            arrow.children[0].classList.remove('rotated');\r\n        } else {\r\n            arrow.onclick = () => Util.scrollTo('home');\r\n            arrow.children[0].classList.add('rotated');\r\n        }\r\n    } \r\n}\r\n\r\nmodule.exports = PageArrow;\n\n//# sourceURL=webpack:///./src/PageArrow.js?");

/***/ }),

/***/ "./src/Util.js":
/*!*********************!*\
  !*** ./src/Util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class Util {\r\n    constructor() {\r\n        throw Error('Static class - do not instanciate');\r\n    }\r\n\r\n    static scrollTo(view) {\r\n        window.scroll({\r\n            top: view === 'docs' ? window.innerHeight : 0,\r\n            left: 0,\r\n            behavior: 'smooth'\r\n        });\r\n    }\r\n}\r\n\r\nwindow.Util = module.exports = Util;\n\n//# sourceURL=webpack:///./src/Util.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Documentation = __webpack_require__(/*! ./Documentation.js */ \"./src/Documentation.js\");\r\nconst PageArrow = __webpack_require__(/*! ./PageArrow.js */ \"./src/PageArrow.js\");\r\n\r\nconst docs = new Documentation();\r\nnew PageArrow();\r\ndocs.init();\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });