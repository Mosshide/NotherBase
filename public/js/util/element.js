// a class called Element that adds functionality to a JQuery element
// Element should be used as a base class for other elements
class Element {
    constructor(elementType = "div", settings = {}) {
        this.settings = {
            defaultClasses: "",
            attributes: {},
            id: null,
            src: null,
            placeholder: "",
            hidden: false,
            onClick: null,
            onInput: null,            
            onClose: null,
            header: null,
            styles: null,
            ...settings
        };
        this.type = elementType;
        this.parent = null;
        this.children = [];
        this.$div = null;
        this.value = this.settings.placeholder;

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
    render() {
        // create the element
        if (!this.$div) {
            this.$div = $(`<${this.type}></${this.type}>`);
            this.initModifiers();
        }

        this.$div.empty();
        if (this.settings.header) this.$div.append(`<h4>${this.settings.header}</h4>`);

        // render the children
        this.children.forEach((child) => {
            child.render().appendTo(this.$div);
        });

        if (this.settings.hidden) this.hide();
        else this.show();

        if (this.settings.onClick) this.enable();

        return this.$div;
    }

    initModifiers = () => {
        // add the attributes
        if (this.settings.attributes) {
            for (let key in this.settings.attributes) {
                this.$div.attr(key, this.settings.attributes[key]);
            }
        }
        // add the default classes
        if (this.settings.defaultClasses) this.$div.addClass(this.settings.defaultClasses);
        // add the id
        if (this.id) this.$div.attr("id", this.id);
        // add the src
        if (this.settings.src) this.$div.attr("src", this.settings.src);
    }

    // adds a child to the element
    addChild = (child) => {
        this.children.push(child);
        child.setParent(this);
        child.$div.appendTo(this.$div);
        return child;
    }

    // sets the parent of the element
    setParent = (parent) => {
        this.parent = parent;
        if (!this.$div) this.render();
    }

    // removes a child from the element and returns it
    removeChild = (child) => {
        let index = this.children.indexOf(child);
        if (index != -1) {
            this.children.splice(index, 1);
            child.$div.remove();
            child.setParent(null);
            return child;
        }

        return null;
    }

    // removes all children from the element and returns them
    removeChildren = () => {
        let children = this.children;
        this.children = [];
        this.render();
        return children;
    }

    remove = () => {
        if (this.parent) this.parent.removeChild(this);
    }

    // sets the value of the element
    setValue = (value = null) => {
        this.value = value;
        this.render();
    }

    getValue = () => {
        return this.value;
    }

    // resets the value of the element
    resetValue = () => {
        this.value = this.settings.placeholder;
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
        this.$div.addClass("disabled");
    }

    // enables the element
    enable = (onClick = this.settings.onClick) => {
        this.enabled = true;
        if (onClick) this.settings.onClick = onClick;
        if (this.settings.onClick) {
            this.$div.on("click", (e) => {
                this.settings.onClick(e, this);
                e.stopPropagation();
            });
        }

        if (this.settings.onInput) this.$div.on("input", (e) => { 
            return this.settings.onInput(e.currentTarget.value.toLowerCase()); 
        });

        this.$div.removeClass("disabled");
    }

    close = () => {
        this.hide();

        this.$div.remove();

        if (this.settings.onClose) this.settings.onClose();
    }
}

// a class called Text that can be used to display text
class Text extends Element {
    constructor(elementType = "p", settings = {}) {
        super(elementType, {
            ...settings
        });
    }

    // renders the element
    render = () => {
        this.$div = super.render();

        if (this.value) this.$div.append(this.value);
        else this.$div.append(this.settings.placeholder);

        return this.$div;
    }
}

// a class called Alert that can be used to display alerts
class Alert extends Text {
    constructor(settings = {}) {
        super("p", {
            defaultClasses: "alert",
            hidden: true,
            ...settings
        });

        this.addChild(new Element("button", {
            defaultClasses: "hide",
            onClick: () => { this.hide(); },
            placeholder: "X"
        }));
    }

    // renders the element
    render = () => {
        this.$div = super.render();

        this.$div.addClass(this.settings.type);

        return this.$div;
    }
}

// a class called Input that can be used to get user input
class Input extends Element {
    constructor(inputType = "text", settings = {}) {
        super("label", {
            inputType: inputType,
            step: null,
            ...settings
        });
    }

    // renders the element
    render = () => {
        this.$div = super.render();

        this.$input = $(`<input type="${this.settings.inputType}" value="${this.value}" placeholder="${this.settings.placeholder}">`).appendTo(this.$div);

        return this.$div;
    }

    setValue = (value) => {
        if (value != null) {
            if (this.$div) this.$input.val(value);
            this.value = value;
        }
    }

    getValue = () => {
        this.value = this.$input.val();
        return this.value;
    }
}

// a class called TextArea that can be used to get user input
class TextArea extends Element {
    constructor(settings = {}) {
        super("label", {
            ...settings
        });
    }

    // renders the element
    render = () => {
        this.$div = super.render();

        this.$input = $(`<textarea placeholder="${this.settings.placeholder}">${this.value}</textarea>`).appendTo(this.$div);

        return this.$div;
    }

    setValue = (value) => {
        if (value != null) {
            if (this.$div) this.$input.val(value);
            this.value = value;
        }
    }

    getValue = () => {
        this.value = this.$input.val();
        return this.value;
    }
}

// a class called Select that can be used to get user input
class Select extends Element {
    constructor(settings = {}) {
        super("select", {
            options: [],
            ...settings
        });
    }

    // renders the element
    render = () => {
        // create the element
        if (!this.$div) {
            this.$div = $(`<select></select>`);
            this.initModifiers();
        }

        for (let i = 0; i < fields.settings.options.length; i++) {
            // $(`<option class="${fields.settings.name}" value="${fields.settings.options[i]}">${fields.settings.options[i]}</option>`).appendTo($editItem);
            this.addChild(new Element("option", {
                defaultClasses: fields.settings.name,
                placeholder: this.settings.options[i]
            }));
        }

        if (this.settings.hidden) this.hide();
        else this.show();

        this.enable();

        return this.$div;
    }

    setValue = (which) => {
        if (which) {
            if (this.$div) this.$div.find(`option:contains("${which}")`).prop('selected', true);
            this.value = which;
        }
        else {
            if (this.$div) this.$div.find(`option:contains("${this.settings.placeholder}")`).prop('selected', true);
            this.value = this.settings.placeholder;
        }
    }

    getValue = () => {
        this.value = this.$div.find(`option:selected`).text();
        return this.value;
    }
}

// a class called CheckBox that can be used to get user input
class CheckBox extends Element {
    constructor(settings = {}) {
        super("input", {
            ...settings
        });
    }

    // renders the element
    render = () => {
        // create the element
        if (!this.$div) {
            this.$div = $(`<input type="checkbox"></input>`);
            this.initModifiers();
        }

        if (this.value) this.$div.prop("checked", this.value);
        else if (this.settings.placeholder) this.$div.prop("checked", this.settings.placeholder);
        else this.$div.prop("checked", false);

        if (this.settings.hidden) this.hide();
        else this.show();

        this.enable();

        return this.$div;
    }

    setValue = (value) => {
        if (this.$div) this.$div.prop("checked", value);
        this.value = value;
    }

    getValue = () => {
        this.value = this.$div.prop("checked");
        return this.value;
    }
}


// a class called Container that can be used to contain other Elements
class Container extends Element {
    constructor(settings = {}) {
        super("container", {
            defaultClasses: "container",
            ...settings
        });
    }

    // attaches the element
    attach(query = null) {
        if (query) {
            this.$div = $(query);
            this.initModifiers();
        }
        
        if (this.$div) this.$div.empty();

        if (this.settings.header) this.$div.append(`<h4>${this.settings.header}</h4>`);

        // render the children
        this.children.forEach((child) => {
            child.render().appendTo(this.$div);
        });

        if (this.settings.hidden) this.hide();
        else this.show();

        if (this.settings.onClick) this.enable();

        return this.$div;
    }
}