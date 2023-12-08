class ListItem extends Element {
    constructor(id, onClick = null, settings = {}) {
        super("li", {
            id: id,
            onClick: onClick,
            placeholder: "Item",
            ...settings
        });
    }
}

class List extends Element {
    constructor(settings = {}) {
        super("ul", {
            ...settings
        });
    }

    addItem = (item) => {
        this.addChild(new ListItem(this.children.length, this.settings.onClick, {
            placeholder: item
        }));
    }
}