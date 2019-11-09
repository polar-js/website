const Util = require('./Util.js');

class PageArrow {
    constructor() {
        this.observer = new IntersectionObserver(
            entries => this.rotateArrow(entries[0].isIntersecting), 
            {
                root: null,
                rootMargin: '150px',
                threshold: 1.0
            });
        this.observer.observe(document.querySelector('#header-image'));
    }

    rotateArrow(inView) {
        const arrow = document.querySelector('.arrow');
        if (inView) {
            arrow.onclick = () => Util.scrollTo('docs');
            arrow.children[0].classList.remove('rotated');
        } else {
            arrow.onclick = () => Util.scrollTo('home');
            arrow.children[0].classList.add('rotated');
        }
    } 
}

module.exports = PageArrow;