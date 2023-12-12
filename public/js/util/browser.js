class BrowserButtons extends Buttons {
    constructor(browser) {
        super();
        this.browser = browser;

        this.addButton(new Button("edit", (e, self) => { this.browser.edit(); }, { placeholder: "Edit" }));
        this.addButton(new Button("save", (e, self) => { this.browser.save(); }, { placeholder: "Save" }));
        this.addButton(new Button("cancel", (e, self) => { this.browser.cancel(); }, { placeholder: "Cancel" }));
        this.addButton(new Button("delete", (e, self) => { this.browser.attemptDelete(); }, { placeholder: "Delete" }));
        this.addButton(new Button("close", (e, self) => { this.browser.close(); }, { placeholder: "Close" }));
    }
}

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
            if (!Array.isArray(item)) item = [item];
            for (let i = 0; i < item.length; i++) {
                let child = null;
                if (this.fields.children === "image") {
                    if (item[i]) child = new Element("img", {
                        defaultClasses: `image ${this.fields.settings.name}`,
                        src: item[i]
                    });
                    else child = new Element("img", {
                        defaultClasses: `image ${this.fields.settings.name}`,
                        src: this.fields.settings.placeholder
                    });
                }
                else if (this.fields.children === "date-time") {
                    if (item[i]) child = new Text("p", {
                        defaultClasses: `date-time ${this.fields.settings.name}`,
                        placeholder: (new Date(item[i])).toLocaleString()
                    });
                    else child = new Text("p", {
                        defaultClasses: `date-time ${this.fields.settings.name}`
                    });
                }
                else if (this.fields.children === "date") {
                    if (item[i]) child = new Text("p", {
                        defaultClasses: `date ${this.fields.settings.name}`,
                        placeholder: (new Date(item[i])).toLocaleDateString()
                    });
                    else child = new Text("p", {
                        defaultClasses: `date ${this.fields.settings.name}`
                    });
                }
                else if (this.fields.children === "time") {
                    if (item[i]) child = new Text("p", {
                        defaultClasses: `time ${this.fields.settings.name}`,
                        placeholder: (new Date(item[i])).toLocaleTimeString()
                    });
                    else child = new Text("p", {
                        defaultClasses: `time ${this.fields.settings.name}`
                    });
                }
                else if (this.fields.children === "number") {
                    if (item[i]) child = new Text("p", {
                        defaultClasses: `number ${this.fields.settings.name}`,
                        placeholder: item[i]
                    });
                    else child = new Text("p", {
                        defaultClasses: `number ${this.fields.settings.name}`
                    });
                }
                else if (this.fields.children === "boolean") {
                    child = new Text("p", {
                        defaultClasses: `boolean ${this.fields.settings.name}`,
                        placeholder: item[i] ? "Yes" : "No"
                    });
                }
                else if (this.fields.children === "long-string") {
                    if (item[i]) child = new Text("p", {
                        defaultClasses: `long-string ${this.fields.settings.name}`,
                        placeholder: item[i].replace(/(?:\r\n|\r|\n)/g, '<br />')
                    });
                    else child = new Text("p", {
                        defaultClasses: `long-string ${this.fields.settings.name}`
                    });
                }
                else {
                    if (item[i]) child = new Text("p", {
                        defaultClasses: `string ${this.fields.settings.name}`,
                        placeholder: item[i].replace(/(?:\r\n|\r|\n)/g, '<br />')
                    });
                    else child = new Text("p", {
                        defaultClasses: `string ${this.fields.settings.name}`
                    });
                }
                this.addChild(child);
            }
        }
        else {
            this.fields.children.forEach((field) => {
                let child = this.addChild(new ReadBox(field, true));
                if (item) child.setValue(item[field.settings.name]);
                else child.setValue(null);
            });
        }
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
                this.setValue(this.item);
            }, {
                placeholder: "Add"
            }));
        }
        if (this.fields.settings.buttons) {
            if (!this.buttons) this.buttons = this.addChild(new Buttons());
            this.fields.settings.buttons.forEach((button) => {
                this.buttons.addButton(button);
            });
        }
    }

    setValue = (item = null, fields = this.fields) => {
        this.fields = fields;
        this.item = item;
        
        if (!Array.isArray(this.fields.children)) {
            if (!Array.isArray(item)) item = [item];
            for (let i = 0; i < item.length; i++) {
                let child = null;
                let finalItem = item[i];

                if (fields.settings.readOnly) {
                    child = new ReadBox(fields, true);
                }
                else if (fields.children === "number") {
                    child = new Input("number", {
                        defaultClasses: `number ${fields.settings.name}`,
                        step: "any",
                        placeholder: fields.settings.placeholder
                    });
                }
                else if (fields.children === "options") {
                    child = new Select({
                        defaultClasses: `pet-select ${fields.settings.name}`,
                        options: fields.settings.options,
                        placeholder: fields.settings.placeholder
                    });
                }
                else if (fields.children === "boolean") {
                    child = new Input("checkbox", {
                        defaultClasses: `boolean ${fields.settings.name}`,
                        placeholder: fields.settings.placeholder
                    });
                }
                else if (fields.children === "date-time") {
                    if (finalItem) finalItem = new Date(finalItem);

                    child = new Input("datetime-local", {
                        defaultClasses: `${fields.settings.name}`,
                        placeholder: fields.settings.placeholder
                    });
                }
                else if (fields.children === "date") {
                    if (finalItem) {
                        let d = new Date(finalItem);
                        let day = ("0" + d.getDate()).slice(-2);
                        let month = ("0" + (d.getMonth() + 1)).slice(-2);
                        finalItem = `${d.getFullYear()}-${month}-${day}`;
                    }

                    child = new Input("date", {
                        defaultClasses: `${fields.settings.name}`,
                        placeholder: fields.settings.placeholder
                    });
                }
                else if (fields.children === "time") {
                    if (finalItem) {
                        let date = new Date(finalItem);
                        let hours = ("0" + date.getHours()).slice(-2);
                        let minutes = ("0" + date.getMinutes()).slice(-2);
                        let seconds = ("0" + date.getSeconds()).slice(-2);
                        finalItem = `${hours}:${minutes}:${seconds}`;
                    }

                    child = new Input("time", {
                        defaultClasses: `${fields.settings.name}`,
                        placeholder: fields.settings.placeholder
                    });
                }
                else if (fields.children === "long-string") {
                    child = new TextArea({
                        defaultClasses: `long-string ${fields.settings.name}`,
                        placeholder: fields.settings.placeholder,
                        attributes: {
                            rows: "4"
                        }
                    });
                }
                else {
                    child = new Input("text", {
                        defaultClasses: `${fields.settings.name}`,
                        placeholder: fields.settings.placeholder
                    });
                }

                if (child) {
                    child.setValue(finalItem);
                    if (this.nested && this.fields.settings.multiple) child.addChild(new Button("remove", (e, self) => {
                        this.removeChild(self.parent);
                    }, {
                        placeholder: "X"
                    }));
                        
                    this.child = this.addChild(child);
                }
            }
        }
        else {
            fields.children.forEach((field) => {
                let child = this.addChild(new EditBox(field, true));
                this.child[fields.settings.name] = child;
                if (item) child.setValue(item[fields.settings.name]);
                else child.setValue(null);
            });
        }
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
        
        this.buttons = this.addChild(new BrowserButtons(this));
        this.buttons.hideButton();
    }

    delete = async () => {
        if (this.settings.onDelete) this.settings.onDelete();
        this.hide();
        if (this.box?.$div) this.box.$div.remove();
        this.cancelDelete();
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
            this.item = this.box.save();
            
            if (this.settings.onSave) this.settings.onSave(this.item);

            this.read();
        }
    }

    getEdits = () => {
        if (this.state === "edit") {
            this.item = this.box.save();
            return this.item;
        }
        else return null;
    }

    read = (serving = this.serving) => {
        this.state = "read";
        this.serving = serving;

        this.cancelDelete();

        if (this.box) this.removeChild(this.box);
        this.box = this.addChild(new ReadBox(this.serving.fields));
        this.box.setValue(this.serving.data[this.serving.selected], this.serving.fields);

        this.buttons.showButton("close");
        this.buttons.hideButton("save");
        this.buttons.hideButton("cancel");
        this.buttons.showButton("delete");

        if (this.serving.editable) this.buttons.showButton("edit");
        else this.buttons.hideButton("edit");
    }

    new = (serving = this.serving) => {
        this.state = "new";
        this.serving = serving;

        if (this.box?.$div) this.box.$div.remove();
        this.box = new EditBox(this.serving.fields);
        this.$div.append(this.box.$div);

        this.buttons.hideButton("edit");
        this.buttons.showButton("close");
        this.buttons.showButton("save");
        this.buttons.showButton("cancel");
        this.buttons.hideButton("delete");

        this.box.load(this.serving.data[this.serving.selected], this.serving.fields);
    }

    edit = (serving = this.serving) => {
        this.state = "edit";
        this.serving = serving;

        if (this.box?.$div) this.box.$div.remove();
        this.box = this.addChild(new EditBox(this.serving.fields));
        this.box.setValue(this.serving.data[this.serving.selected], this.serving.fields);

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
        super("div", {
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
        this.$div = $(".meta" + (this.settings.id ? `#${this.settings.id}` : ""));
        if (this.settings.label) this.$header = $(`<h4>${this.settings.label}</h4>`).appendTo(this.$div);
        this.buttons = new Buttons(this.settings.id, [], {});
        this.buttons.hideButton();
        this.$div.append(this.buttons.$div);
        this.$alert = $(`<p class="alert invisible"></p>`).appendTo(this.$div);
        this.$hideAlert = $(`<button class="hide">X</button>`).appendTo(this.$alert);
        this.$hideAlert.on("click", () => {
            this.$alert.addClass("invisible");
        });

        if (this.settings.useSearchBox) this.addSearchBox();
    }

    setAlert = (msg) => {
        this.$alert.text(msg);
        this.$hideAlert = $(`<button class="hide">X</button>`).appendTo(this.$alert);
        this.$hideAlert.on("click", () => {
            this.$alert.addClass("invisible");
        });
        this.$alert.removeClass("invisible");
    }

    makeBrowser = () => {
        if (this.settings.useBrowser) {
            this.browser = new this.settings.useBrowser(this.serving, {
                onSave: this.save,
                onEdit: this.edit,
                onCancel: this.cancel,
                onDelete: this.delete,
                onClose: this.close
            });
        }
    }

    save = (item) => {
        this.serving.state = "read";
        this.serving.data[this.serving.selected] = item;
        if (this.serving.toSave) this.serving.toSave(this.serving.data, this.serving.selected);
    }

    edit = () => {
        this.serving.state = "edit";
    }

    cancel = () => {
        this.serving.state = "read";
    }

    delete = () => {
        this.serving.state = "search";
        this.serving.data.splice(this.serving.selected, 1);
        if (this.serving.toSave) this.serving.toSave(this.serving.data, this.serving.selected, true);
    }

    close = () => {
        this.serving.state = "search";
        this.disabledElement.enable();
        this.disabledElement = null;
        this.browser = null;
    }

    addSearchBox = () => {
        this.searchBox = new this.settings.useSearchBox({
            onLiClick: (e, element) => {
                if (this.browser) {
                    this.browser.close();
                }
                this.serving.selected = element.settings.id;
                element.disable();
                this.disabledElement = element;
                this.makeBrowser();
                this.browser.read(this.serving);
                element.addChild(this.browser);
            },
            onNew: () => {
                this.serving.selected = this.serving.data.length;
                this.makeBrowser();
                this.browser.new(this.serving);
                this.searchBox.list.children[this.serving.selected].addChild(this.browser);
                this.searchBox.list.children[this.serving.selected].disable();
            }
        });
        this.searchBox.render();
        this.$div.append(this.searchBox.$div);
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
            label: `Switch to ${this.services[service].label ? this.services[service].label : service}`
        }));

        this.load(service);
    }

    load = (service = this.selectedService) => {
        let serving = this.services[service];

        if (serving.toLoad) serving.toLoad().then((res) => {
            serving.data = res;
            this.selectService(service);
        });
    }

    selectService = (service) => {
        if (this.serving) {
            this.serving.lastEdit = this.searchBox.getEdits();
            this.serving.lastFilter = this.searchBox.getFilters();
        }

        this.hideBrowser();
        this.hideSearch();

        this.buttons.showButton(this.selectedService);

        this.selectedService = service;
        this.serving = this.services[this.selectedService];

        this.searchBox.setItems(this.serving.data);
        this.searchBox.setFilters(this.serving.lastFilter);
        
        if (this.serving.state == "search") this.searchBox.show();
        else if (this.serving.state == "edit") {
            this.browser.edit(this);
            this.browser.show();
        }
        else if (this.serving.state == "new") {
            this.browser.new(this);
            this.browser.show();
        }
        else {
            this.browser.read(this);
            this.browser.show();
        }

        this.buttons.hideButton(this.selectedService);
    }  

    hide = () => {
        this.$div.addClass("invisible");
    }

    show = () => {
        this.$div.removeClass("invisible");
    }

    showSearch = () => {
        if (this.searchBox) this.searchBox.show();
    }

    hideSearch = () => {
        if (this.searchBox) this.searchBox.hide();
    }

    hideBrowser = () => {
        if (this.browser) this.browser.hide();
    }

    showBrowser = () => {
        if (this.browser) this.browser.show();
    }
}