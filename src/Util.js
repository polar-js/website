class Util {
    constructor() {
        throw Error('Static class - do not instanciate');
    }

    static scrollTo(view) {
        window.scroll({
            top: view === 'docs' ? window.innerHeight : 0,
            left: 0,
            behavior: 'smooth'
        });
    }
}

window.Util = module.exports = Util;