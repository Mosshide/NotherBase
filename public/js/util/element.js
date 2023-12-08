// a class called Element that adds functionality to a JQuery element
// Element should be used as a base class for other elements
class Element {
    constructor(elementType = "div", settings = {}) {
        this.settings = {
            defaultClasses: "",
            id: null,
            src: null,
            placeholder: "",
            hidden: false,
            onClick: null,
            onInput: null,
            header: null,
            styles: null,
            ...settings
        };
        this.type = elementType;
        this.parent = null;
        this.children = [];
        this.$div = null;
        this.value = null;

        if (this.settings.styles) Element.attemptStyle(this.settings.styles);
    }

    static styled = {};

    static attemptStyle(which) {
        if (!Element.styled[which]) {
            $("head").append(`<link href='/styles/${which}.css' rel='stylesheet' />`);
            Element.styled[which] = true;
        }
    }

    // renders the element
    render = () => {
        // remove the element if it already exists
        if (this.$div) this.$div.remove();
        // create the element
        this.$div = $(`<${this.type}></${this.type}>`);

        // insert the placeholder
        this.resetValue();

        // add the default classes
        this.$div.addClass(this.settings.defaultClasses);
        // add the id
        if (this.id) this.$div.attr("id", this.id);
        // add the src
        if (this.settings.src) this.$div.attr("src", this.settings.src);

        // render the children
        this.children.forEach((child) => {
            child.render().appendTo(this.$div);
        });

        if (this.settings.hidden) this.hide();
        else this.show();

        if (this.settings.onClick) this.enable();

        return this.$div;
    }

    // adds a child to the element
    addChild = (child, rerender = true) => {
        this.children.push(child);
        child.setParent(this);
        if (rerender || !child.$div) child.render();
        child.$div.appendTo(this.$div);
        return child;
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
        this.value = value;
    }

    getValue = (which = null) => {
        if (which) return this.value[which];
        return this.value;
    }

    // resets the value of the element
    resetValue = () => {
        this.$div.empty();
        if (this.settings.placeholder) this.$div.text(this.settings.placeholder);
        if (this.settings.header) this.$div.prepend(`<h4>${this.settings.header}</h4>`);
        this.value = null;
    }

    // hides the element
    hide = () => {
        this.settings.hidden = true;
        this.$div.addClass("invisible");
    }

    // shows the element
    show = () => {
        this.settings.hidden = false;
        this.$div.removeClass("invisible");
    }

    toggle = () => {
        if (this.settings.hidden) this.show();
        else this.hide();
    }

    // disables the element
    disable = () => {
        this.enabled = false;
        this.$div.off();
    }

    // enables the element
    enable = (onClick = this.onClick) => {
        this.enabled = true;
        if (onClick) this.settings.onClick = onClick;
        if (this.settings.onClick) {
            this.$div.on("click", (e) => {
                this.settings.onClick(e, this);
            });
        }

        if (this.settings.onInput) this.$div.on("input", (e) => { 
            return this.settings.onInput(e.currentTarget.value.toLowerCase()); 
        });
    }
}


// a class called Container that can be used to contain other Elements
class Container extends Element {
    constructor(elementType = "div", settings = {}) {
        super(elementType, {
            defaultClasses: "container",
            ...settings
        });
    }

    // renders the element
    render = (query = null) => {
        if (query) this.$div = $(query);
        
        if (this.$div) this.$div.empty();

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
}