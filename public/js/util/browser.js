class NBField {
    constructor(settings, children) {
        this.settings = {
            name: "default",
            label: "",
            placeholder: "",
            multiple: false,
            lockLength: false,
            readOnly: false,
            hidden: false,
            buttons: [],
            ...settings
        }

        this.children = children;
    }
}

class ReadBox extends Element {
    constructor(fields, nested = false, settings = {}) {
        super("div", {
            defaultClasses: `read ${nested ? "nested" : ""}`,
            header: fields.settings.label,
            ...settings
        });
        this.fields = fields;

        if (this.fields.settings.buttons) {
            this.buttons = this.addChild(new Buttons());
            this.fields.settings.buttons.forEach((button) => {
                this.buttons.addButton(button);
            });
        }
    }

    setValue = (item = null, fields = this.fields) => {
        this.fields = fields;
        this.item = item;
        
        if (!Array.isArray(this.fields.children)) {
            if (this.fields.settings.multiple) for (let i = 0; i < item.length; i++) {
                this.createChild(item[i]);
            }
            else this.createChild(item);
        }
        else {
            this.fields.children.forEach((field) => {
                let child = this.addChild(new ReadBox(field, true));
                if (item) child.setValue(item[field.settings.name]);
                else child.setValue(null);
            });
        }
    }

    createChild = (item) => {
        let child = null;
        if (this.fields.children === "image") {
            if (item) child = new Element("img", {
                defaultClasses: `image ${this.fields.settings.name}`,
                src: item
            });
            else child = new Element("img", {
                defaultClasses: `image ${this.fields.settings.name}`,
                src: this.fields.settings.placeholder
            });
        }
        else if (this.fields.children === "date-time") {
            if (item) child = new Text("p", {
                defaultClasses: `date-time ${this.fields.settings.name}`,
                placeholder: (new Date(item)).toLocaleString()
            });
            else child = new Text("p", {
                defaultClasses: `date-time ${this.fields.settings.name}`
            });
        }
        else if (this.fields.children === "date") {
            if (item) child = new Text("p", {
                defaultClasses: `date ${this.fields.settings.name}`,
                placeholder: (new Date(item)).toLocaleDateString()
            });
            else child = new Text("p", {
                defaultClasses: `date ${this.fields.settings.name}`
            });
        }
        else if (this.fields.children === "time") {
            if (item) child = new Text("p", {
                defaultClasses: `time ${this.fields.settings.name}`,
                placeholder: (new Date(item)).toLocaleTimeString()
            });
            else child = new Text("p", {
                defaultClasses: `time ${this.fields.settings.name}`
            });
        }
        else if (this.fields.children === "number") {
            if (item) child = new Text("p", {
                defaultClasses: `number ${this.fields.settings.name}`,
                placeholder: item
            });
            else child = new Text("p", {
                defaultClasses: `number ${this.fields.settings.name}`
            });
        }
        else if (this.fields.children === "boolean") {
            child = new Text("p", {
                defaultClasses: `boolean ${this.fields.settings.name}`,
                placeholder: item ? "Yes" : "No"
            });
        }
        else if (this.fields.children === "long-string") {
            if (item) {
                if (typeof item !== "string") item = item.toString();
                child = new Text("p", {
                    defaultClasses: `long-string ${this.fields.settings.name}`,
                    placeholder: item.replace(/(?:\r\n|\r|\n)/g, '<br />')
                });
            }
            else child = new Text("p", {
                defaultClasses: `long-string ${this.fields.settings.name}`
            });
        }
        else {
            if (item) {
                if (typeof item !== "string") item = item.toString();
                child = new Text("p", {
                    defaultClasses: `string ${this.fields.settings.name}`,
                    placeholder: item.replace(/(?:\r\n|\r|\n)/g, '<br />')
                });
            }
            else child = new Text("p", {
                defaultClasses: `string ${this.fields.settings.name}`
            });
        }
        return this.addChild(child);
    }
}

class EditBox extends Element {
    constructor(fields, nested = false, settings = {}) {
        super("div", {
            defaultClasses: `edit ${nested ? "nested" : ""}`,
            header: fields.settings.label,
            ...settings
        });
        this.fields = fields;
        this.child = {};
        this.nested = nested;

        if (this.nested && this.fields.settings.multiple) {
            if (!this.buttons) this.buttons = this.addChild(new Buttons());
            this.buttons.addButton(new Button("add", (e, self) => {
                this.createChild(null);
            }, {
                placeholder: "Add"
            }));
        }
        if (this.fields.settings.buttons.length > 0) {
            if (!this.buttons) this.buttons = this.addChild(new Buttons());
            this.fields.settings.buttons.forEach((button) => {
                this.buttons.addButton(button);
            });
        }
    }

    setValue = (item = null, fields = this.fields) => {
        this.fields = fields;
        this.settings.defaultClasses = `edit${this.nested ? " nested" : ""}${fields.settings.multiple ? " multiple" : ""}`;
        this.initModifiers();
        this.item = item;
        
        if (!Array.isArray(this.fields.children)) {
            console.log(item, fields);
            if (fields.settings.multiple && Array.isArray(item)) for (let i = 0; i < item.length; i++) {
                console.log(item[i]);
                this.createChild(item[i]);
            }
            else {
                this.createChild(item);
            }
        }
        else {
            fields.children.forEach((field) => {
                let child = this.addChild(new EditBox(field, true));
                this.child[field.settings.name] = child;
                if (item) child.setValue(item[field.settings.name]);
                else child.setValue(null);
            });
        }
    }

    createChild = (finalItem) => {
        let child = null;
        if (this.fields.settings.readOnly) {
            child = new ReadBox(this.fields, true);
        }
        else if (this.fields.children === "number") {
            child = new Input("number", {
                defaultClasses: `number ${this.fields.settings.name}`,
                step: "any",
                placeholder: this.fields.settings.placeholder
            });
        }
        else if (this.fields.children === "options") {
            child = new Select({
                defaultClasses: `pet-select ${this.fields.settings.name}`,
                options: this.fields.settings.options,
                placeholder: this.fields.settings.placeholder
            });
        }
        else if (this.fields.children === "boolean") {
            child = new Input("checkbox", {
                defaultClasses: `boolean ${this.fields.settings.name}`,
                placeholder: this.fields.settings.placeholder
            });
        }
        else if (this.fields.children === "date-time") {
            if (finalItem) finalItem = new Date(finalItem);

            child = new Input("datetime-local", {
                defaultClasses: `${this.fields.settings.name}`,
                placeholder: this.fields.settings.placeholder
            });
        }
        else if (this.fields.children === "date") {
            if (finalItem) {
                let d = new Date(finalItem);
                let day = ("0" + d.getDate()).slice(-2);
                let month = ("0" + (d.getMonth() + 1)).slice(-2);
                finalItem = `${d.getFullYear()}-${month}-${day}`;
            }

            child = new Input("date", {
                defaultClasses: `${this.fields.settings.name}`,
                placeholder: this.fields.settings.placeholder
            });
        }
        else if (this.fields.children === "time") {
            if (finalItem) {
                let date = new Date(finalItem);
                let hours = ("0" + date.getHours()).slice(-2);
                let minutes = ("0" + date.getMinutes()).slice(-2);
                let seconds = ("0" + date.getSeconds()).slice(-2);
                finalItem = `${hours}:${minutes}:${seconds}`;
            }

            child = new Input("time", {
                defaultClasses: `${this.fields.settings.name}`,
                placeholder: this.fields.settings.placeholder
            });
        }
        else if (this.fields.children === "long-string") {
            child = new TextArea({
                defaultClasses: `long-string ${this.fields.settings.name}`,
                placeholder: this.fields.settings.placeholder,
                attributes: {
                    rows: "4"
                }
            });
        }
        else {
            child = new Input("text", {
                defaultClasses: `${this.fields.settings.name}`,
                placeholder: this.fields.settings.placeholder
            });
        }

        console.log(child);
        
        if (child) {
            child.setValue(finalItem);
            console.log(this.fields.children, child, finalItem, this.nested, this);
            if (this.nested && this.fields.settings.multiple) child.addChild(new Button("remove", (e, self) => {
                self.parent.close();
            }, {
                placeholder: "X"
            }));
                
            this.child = this.addChild(child);
        }

        return child;
    }

    getValue = () => {
        let toGo = {};

        if (Array.isArray(this.fields.children)) {
            for (let i = 0; i < this.fields.children.length; i++) {
                if (!this.fields.children[i].settings.hidden && !this.fields.children[i].settings.readOnly) {
                    toGo[this.fields.children[i].settings.name] = this.child[this.fields.children[i].settings.name].getValue();
                }
            }
        }
        else {
            toGo = [];
            if (this.fields.settings.multiple) for (let i = 1; i < this.children.length; i++) {
                toGo.push(this.children[i].getValue());

                if (this.fields.children == "date-time") {
                    toGo[toGo.length - 1] = new Date(toGo).getTime();
                }
                else if (this.fields.children == "date") {
                    let date = toGo[toGo.length - 1].split("-");
                    toGo[toGo.length - 1] = new Date(date[0], date[1] - 1, date[2]).getTime();
                }
                else if (this.fields.children == "time") {
                    let time = toGo[toGo.length - 1].split(" ")[0].split(":");
                    let date = new Date();
                    date.setHours(time[0]);
                    date.setMinutes(time[1]);
                    date.setSeconds(time[2]);
                    toGo[toGo.length - 1] = date.getTime();
                }
            }
            else {
                toGo = this.child.getValue();

                if (this.fields.children == "date-time") {
                    toGo = new Date(toGo).getTime();
                }
                else if (this.fields.children == "date") {
                    let date = toGo.split("-");
                    toGo = new Date(date[0], date[1] - 1, date[2]).getTime();
                }
                else if (this.fields.children == "time") {
                    let time = toGo.split(" ")[0].split(":");
                    let date = new Date();
                    date.setHours(time[0]);
                    date.setMinutes(time[1]);
                    date.setSeconds(time[2]);
                    toGo = date.getTime();
                }
            }
        }

        return toGo;
    }
}

/**
 * A browser that shows or edits spirit data.
 * @class
 */
class Browser extends Element {
    /**
     * Represents spirit data with fields, settings, and buttons.
     * @constructor
     * @param {string} id - The ID of the browser.
     * @param {NBField} [fields=new NBField()] - The fields of the spirit data.
     * @param {Object} [settings={}] - The settings of the browser.
     * @param {Function} [settings.onSave=null] - The function to call when the spirit data is saved.
     * @param {Function} [settings.onEdit=null] - The function to call when the spirit data is edited.
     * @param {Function} [settings.onCancel=null] - The function to call when the edit is cancelled.
     * @param {boolean} [settings.disableSave=false] - Whether to disable the save button.
     */
    constructor(serving = null, settings = {}) {
        super("div", {
            defaultClasses: "browser",
            editable: true,
            onSave: null,
            onEdit: null,
            onCancel: null,
            onDelete: null,
            onClose: null,
            disableSave: false,
            styles: "browser",
            ...settings
        });
        this.state = "read";
        this.serving = serving;

        this.box = null;
        
        this.buttons = this.addChild(new Buttons(this));
        this.buttons.addButton(new Button("edit", (e, self) => { this.edit(); }, { placeholder: "Edit" }));
        this.buttons.addButton(new Button("save", (e, self) => { this.save(); }, { placeholder: "Save" }));
        this.buttons.addButton(new Button("cancel", (e, self) => { this.cancel(); }, { placeholder: "Cancel" }));
        this.buttons.addButton(new Button("delete", (e, self) => { this.attemptDelete(); }, { placeholder: "Delete" }));
        this.buttons.addButton(new Button("close", (e, self) => { this.close(); }, { placeholder: "Close" }));
        this.buttons.hideButton();
    }

    delete = async () => {
        if (this.settings.onDelete) this.settings.onDelete();
        this.close();
    }

    attemptDelete = () => {
        this.buttons.buttons.delete.$div.empty();
        this.buttons.buttons.delete.disable();

        this.lastAttempt = Date.now();

        this.$cancel = $(`<button id="cancel-delete">Cancel</button>`).appendTo(this.buttons.buttons.delete.$div);
        this.$cancel.on("click", (e) => {
            this.cancelDelete();
            e.stopPropagation();
        });

        this.$confirm = $(`<button id="confirm-delete">Confirm Delete</button>`).appendTo(this.buttons.buttons.delete.$div);
        this.$confirm.on("click", (e) => {
            if (Date.now() - this.lastAttempt > 1000) {
                this.delete();
                e.stopPropagation();
            }
        });
    }

    cancelDelete = () => {
        this.buttons.buttons.delete.$div.empty();
        this.buttons.buttons.delete.$div.text("Delete");
        this.buttons.buttons.delete.enable();
    }

    save = async () => {
        if (this.state === "edit" || this.state === "new") {
            this.item = this.box.getValue();
            
            if (this.settings.onSave) this.settings.onSave(this.item);

            this.read();
        }
    }

    read = (serving = this.serving) => {
        this.state = "read";
        this.serving = serving;

        this.cancelDelete();

        if (this.box) this.box.close();
        this.box = this.addChild(new ReadBox(this.serving.fields));
        this.box.setValue(this.serving.data[this.serving.selected], this.serving.fields);

        this.buttons.showButton("close");
        this.buttons.hideButton("save");
        this.buttons.hideButton("cancel");
        this.buttons.showButton("delete");

        if (this.serving.editable) this.buttons.showButton("edit");
        else this.buttons.hideButton("edit");
    }

    new = (serving = this.serving, itemOverride = null) => {
        this.state = "new";
        this.serving = serving;

        if (this.box) this.box.close();
        this.box = this.addChild(new EditBox(this.serving.fields));
        this.box.setValue(itemOverride ? itemOverride : null, this.serving.fields);

        this.buttons.hideButton("edit");
        this.buttons.showButton("close");
        this.buttons.showButton("save");
        this.buttons.showButton("cancel");
        this.buttons.hideButton("delete");
    }

    edit = (serving = this.serving, itemOverride = null) => {
        this.state = "edit";
        this.serving = serving;
        
        if (this.box?.$div) this.box.close();
        this.box = this.addChild(new EditBox(this.serving.fields));
        this.box.setValue(itemOverride ? itemOverride : this.serving.data[this.serving.selected], this.serving.fields);

        this.buttons.hideButton("edit");
        this.buttons.hideButton("close");
        this.buttons.showButton("save");
        this.buttons.showButton("cancel");
        this.buttons.hideButton("delete");

        if (this.settings.onEdit) this.settings.onEdit();
    }

    cancel = () => {
        this.read();

        if (this.settings.onCancel) this.settings.onCancel();
    }    
}

//
class MetaBrowser extends Container {
    /**
     * Represents a browser utility for browsing and managing services.
     * @constructor
     * @param {string} [label="Browse"] - The label for the browser.
     * @param {Object} [browser=null] - The browser object.
     * @param {Object} [searchBox=null] - The search box object.
     * @param {string} [id=null] - The ID for the browser.
     */
    constructor(settings = {}) {
        super({
            header: "Browse", 
            useBrowser: Browser, 
            useSearchBox: SearchBox,
            styles: "browser",
            ...settings
        });

        this.browser = null;
        this.searchBox = null;
        this.services = {};
        this.selectedService = "";
        this.serving = null;
        this.disabledElement = null;
        
        this.buttons = this.addChild(new Buttons(this.settings.id, [], {}));
        this.buttons.hideButton();
        
        this.alert = this.addChild(new Alert());

        if (this.settings.useSearchBox) this.addSearchBox();
    }

    render() {
        this.$div = super.render(`.meta${this.settings.id ? `#${this.settings.id}` : ""}`);

        return this.$div;
    }

    setAlert = (msg) => {
        this.$alert.setValue(msg);
        this.$alert.show();
    }

    makeBrowser = () => {
        if (this.settings.useBrowser) {
            this.browser = new this.settings.useBrowser(this.serving, {
                onSave: this.save,
                onEdit: this.edit,
                onCancel: this.cancel,
                onDelete: this.delete,
                onClose: () => {
                    if (this.serving.state == "new" || this.serving.state == "delete") {
                        this.serving.data.splice(this.serving.selected, 1);
                        this.disabledElement.close();
                    }
                    else {
                        this.disabledElement.enable();
                        this.disabledElement.setValue(this.settings.useSearchBox.extractLabel(this.serving.data[this.serving.selected]));
                    }
                    this.serving.state = "search";
                    this.disabledElement = null;
                    this.browser = null;
                }
            });
        }
    }

    save = (item) => {
        this.serving.state = "read";
        this.serving.data[this.serving.selected] = item;
        if (this.serving.toSave) this.serving.toSave(this.serving.data[this.serving.selected], this.serving.selected);
    }

    edit = () => {
        this.serving.state = "edit";
    }

    cancel = () => {
        this.serving.state = "read";
    }

    delete = () => {
        this.serving.state = "delete";
        this.serving.data.splice(this.serving.selected, 1);
        if (this.serving.toSave) this.serving.toSave(this.serving.data, this.serving.selected, true);
    }

    addSearchBox = () => {
        this.searchBox = new this.settings.useSearchBox({
            onLiClick: (e, element) => {
                if (this.browser) {
                    this.browser.close();
                }

                this.serving.selected = element.settings.id;
                this.serving.state = "read";
                element.disable();
                this.disabledElement = element;
                this.makeBrowser();
                this.browser.read(this.serving);
                element.addChild(this.browser);
            },
            onNew: (e, element) => {
                if (this.browser) {
                    this.browser.close();
                }

                this.serving.selected = this.serving.data.length;
                this.serving.state = "new";
                let newElement = this.searchBox.addItem(this.serving.lastEdit);
                newElement.disable();
                this.disabledElement = newElement;
                this.makeBrowser();
                this.browser.new(this.serving);
                newElement.addChild(this.browser);
            }
        });
        this.addChild(this.searchBox);
    }

    addService = (service, settings) => {
        this.services[service] = {
            selected: 0,
            state: "search",
            lastFilter: "",
            lastEdit: {},
            label: null,
            data: [],
            fields: new NBField(),
            editable: false,
            toLoad: null, //async () => { return null; },
            toSave: null, //async (items, which) => { },
            ...settings
        };

        this.buttons.addButton(new Button(service, () => { this.selectService(service); }, {
            placeholder: `Switch to ${this.services[service].label ? this.services[service].label : service}`
        }));

        let keys = Object.keys(this.services);
        if (keys.length < 2) this.load(service);
        else this.load(service, false);
    }

    load = (service = this.selectedService, select = true) => {
        let serving = this.services[service];

        if (serving.toLoad) serving.toLoad().then((res) => {
            serving.data = res;
            if (select) this.selectService(service);
        });
    }

    selectService = (service) => {
        if (this.serving) {
            if (this.serving.state == "edit" || this.serving.state == "new") {
                this.serving.lastEdit = this.browser.box.getValue();
            }
            this.serving.lastFilter = this.searchBox.getFilters();
        }

        this.buttons.showButton(this.selectedService);

        this.selectedService = service;
        this.buttons.hideButton(this.selectedService);

        this.serving = this.services[this.selectedService];

        this.searchBox.setItems(this.serving.data);
        this.searchBox.setFilters(this.serving.lastFilter);
        
        if (this.serving.state == "edit") {
            let element = this.searchBox.list.children[this.serving.selected];
            element.disable();
            this.disabledElement = element;
            this.makeBrowser();
            this.browser.edit(this.serving, this.serving.lastEdit);
            element.addChild(this.browser);
        }
        else if (this.serving.state == "new") {
            let element = this.searchBox.list.children[this.serving.selected];
            element.disable();
            this.disabledElement = element;
            this.makeBrowser();
            this.browser.new(this.serving, this.serving.lastEdit);
            element.addChild(this.browser);
        }
        else if (this.serving.state == "read") {
            let element = this.searchBox.list.children[this.serving.selected];
            element.disable();
            this.disabledElement = element;
            this.makeBrowser();
            this.browser.read(this.serving);
            element.addChild(this.browser);
        }      
    }  
}