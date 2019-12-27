class Util {
    static scrollTo(view) {
        window.scroll({
            top: view === 'docs' ? window.innerHeight : 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

window.Util = module.exports = Util;