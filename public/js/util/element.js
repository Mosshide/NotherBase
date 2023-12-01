//WIP
// a class called Element that adds functionality to a JQuery element
class Element {
    constructor(elementType = "div", defaultClasses = "", id = null, placeholder = "", children = []) {
        this.elementType = elementType;
        this.defaultClasses = defaultClasses;
        this.id = id;
        this.parent = null;
        this.children = children;
        this.placeholder = placeholder;
    }

    // renders the element
    render = (query = null) => {
        if (!query) {
            // create the element
            this.$div = $(`<${this.type}>${this.placeholder}</${this.type}>`);
        }
        else {
            // find the element
            this.$div = $(query);
        }

        // add the default classes
        this.$div.addClass(this.defaultClasses);
        // add the id
        if (this.id) this.$div.attr("id", this.id);

        // render the children
        this.children.forEach((child) => {
            child.render().appendTo(this.$div);
        });

        return this.$div;
    }

    // adds a child to the element
    addChild = (child, rerender = true) => {
        this.children.push(child);
        child.setParent(this);
        if (rerender) child.render().appendTo(this.$div);
    }

    // sets the parent of the element
    setParent = (parent) => {
        this.parent = parent;
    }

    // removes a child from the element and returns it
    removeChild = (child) => {
        let index = this.children.indexOf(child);
        if (index != -1) {
            this.children.splice(index, 1);
            child.setParent(null);
            return child;
        }

        return null;
    }

    // sets the value of the element
    setValue = (value = null) => {
        this.$div.text(value);
    }

}