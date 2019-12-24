

class Location {

    static init() {
        if (window.location.hash.length > 1) {
            if (window.location.hash[1] != '/') {
                window.location.hash = '';
            }
        }
    }

    static getPage() {
        return Location.getURLHashItem(1);
    }

    static setPage(value) {
        Location.setURLHashItem(1, value);
    }

    static getVersion() {
        return Location.getURLHashItem(2);
    }

    static setVersion(value) {
        Location.setURLHashItem(2, value);
    }

    static getHeading() {
        return Location.getURLHashItem(3);
    }

    static setHeading(value) {
        Location.setURLHashItem(3, value);
    }

    static getSelected() {
        return Location.getURLHashItem(4);
    }

    static setSelected(value) {
        Location.setURLHashItem(4, value);
    }

    // Items: [0] Hashtag, [1] Page, [2] Version, [3] Heading, [4] Selected.
    static getURLHashItem(index) {
        const items = window.location.hash.split('/');
        if (items.length > index) {
            return items[index];
        }
        return null;
    }

    // Items: [0] Hashtag, [1] Page, [2] Version, [3] Heading, [4] Selected.
    static setURLHashItem(index, value) {
        const items = window.location.hash.split('/');
        if (items.length > index) {
            items[index] = value;
            window.location.hash = items.join('/');
        }
        else {
            if (items.length === 0 && index === 1) {
                window.location.hash = `/${value}`;
            }
            else if (items.length === index) {
                items.push(value);
                window.location.hash = items.join('/');
            }
            else {
                console.error('Previous URL hash item not set!');
            }
        }
    }

    static truncateItems(toIndex) {
        const items = window.location.hash.split('/');
        window.location.hash = items.slice(0, toIndex).join('/');
    }
}

module.exports = Location;