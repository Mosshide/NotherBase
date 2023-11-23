class Button {
    constructor(id, settings) {
        this.settings = {
            onClick: null,
            label: null,
            hidden: false,
            parent: null,
            ...settings
        };

        this.id = id;

        this.$div = null;

        this.render();
    }

    render = () => {
        if (this.$div) this.$div.empty();
        else this.$div = $(`<button>=</button>`);

        if (this.settings.hidden) this.$div.addClass("invisible");
        if (this.id) this.$div.attr("id", this.id);
        if (this.settings.label) this.$div.text(this.settings.label);

        this.enable();
    }

    hide = () => {
        this.settings.hidden = true;
        this.$div.addClass("invisible");
    }

    show = () => {
        this.settings.hidden = false;
        this.$div.removeClass("invisible");
    }

    disable = () => {
        this.enabled = false;
        this.$div.off();
    }

    enable = (onClick = null) => {
        this.enabled = true;
        if (onClick) this.settings.onClick = onClick;
        if (this.settings.onClick) {
            this.$div.on("click", (e) => {
                this.settings.onClick(e);
            });
        }
    }
}

class Buttons {
    constructor(id, BaseButtons = [], settings = {}) {
        this.settings = {
            $origin: null,
            isTabs: false,
            label: null,
            ...settings
        };
        this.id = id;

        Buttons.attemptStyle();

        this.buttons = {};
        this.BaseButtons = BaseButtons;

        this.render();

        for (let i = 0; i < this.BaseButtons.length; i++) {
            this.addButton(new (this.BaseButtons[i])());
        }
    }

    static styled = false;

    static attemptStyle() {
        if (!Buttons.styled) {
            $("head").append(`<link href='/styles/buttons.css' rel='stylesheet' />`);
            Buttons.styled = true;
        }
    }

    render = () => {
        if (this.$div) this.$div.empty();
        else {
            if (!this.settings.$origin) this.$div = $(`<div class="buttons"></div>`);
            else this.$div = this.settings.$origin;

            if (this.id) this.$div.attr("id", this.id);
            if (this.settings.isTabs) this.$div.addClass("tabs");
    
            this.$div.on("click", () => { this.click(); });
        }
        
        if (this.settings.label) this.$header = $(`<h4>${this.settings.label}</h4>`).appendTo(this.$div);

        let keys = Object.keys(this.buttons);
        for (let i = 0; i < keys.length; i++) {
            this.$div.append(this.buttons[keys[i]].$div);
        }
    }

    addButton = (button) => {
        this.buttons[button.id] = button;
        this.buttons[button.id].settings.parent = this;

        this.$div.append(button.$div);
    }

    hide = (which = null) => {
        if (which) this.buttons[which].hide();
        else {
            let keys = Object.keys(this.buttons);

            for (let i = 0; i < keys.length; i++) {
                this.buttons[keys[i]].hide();
            }
        }
    }

    show = (which) => {
        if (which) this.buttons[which].show();
        else {
            let keys = Object.keys(this.buttons);

            for (let i = 0; i < keys.length; i++) {
                this.buttons[keys[i]].show();
            }
        }
    }

    enable = (which, onClick = null) => {
        if (which) this.buttons[which].enable(onClick);
        else {
            let keys = Object.keys(this.buttons);

            for (let i = 0; i < keys.length; i++) {
                this.buttons[keys[i]].enable(onClick);
            }
        }
    }

    disable = (which) => {
        if (which) this.buttons[which].disable();
        else {
            let keys = Object.keys(this.buttons);

            for (let i = 0; i < keys.length; i++) {
                this.buttons[keys[i]].disable();
            }
        }
    }

    click = () => {
    }
}