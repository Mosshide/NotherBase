class BrowserButtons extends Buttons {
    constructor(browser) {
        super();

        this.addButton(new Button("edit", browser.edit, { placeholder: "Edit" }));
        this.addButton(new Button("save", browser.save, { placeholder: "Save" }));
        this.addButton(new Button("cancel", browser.cancel, { placeholder: "Cancel" }));
        this.addButton(new Button("delete", browser.attemptDelete, { placeholder: "Delete" }));
        this.addButton(new Button("close", browser.close, { placeholder: "Close" }));
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
            ...settings
        }

        this.children = children;
    }
}

class ReadBox extends List {
    constructor(fields, nested = false, settings = {}) {
        super({
            defaultClasses: `read ${nested ? "nested" : ""}`,
            header: fields.settings.label,
            fields: fields,
            ...settings
        });

        if (this.fields.settings.buttons) this.addChild(new Buttons());
        foreach(this.fields.settings.buttons, (button) => {
            this.buttons.addButton(button);
        });

        this.content = this.addChild(new List(), {
            defaultClasses: `content ${this.fields.settings.label ? "headed" : ""}`
        });
    }

    // adds a child to the content element
    addChild = (item) => {
        this.children.push(child);
        child.setParent(this);
        if (rerender || !child.$div) child.render();
        child.$div.appendTo(this.content.$div);
        return child;
    }

    setValue = (item = null, fields = this.fields) => {
        this.fields = fields;
        this.item = item;
        
        if (typeof item != "object") {
            if (!Array.isArray(item)) item = [item];
            for (let i = 0; i < item.length; i++) {
                let child = null;
                if (field.children === "image") {
                    if (item) child = new Element("img", {
                        defaultClasses: `image ${field.settings.name}`,
                        src: item
                    });
                    else child = new Element("img", {
                        defaultClasses: `image ${field.settings.name}`,
                        src: field.settings.placeholder
                    });
                }
                else if (field.children === "date-time") {
                    if (item) child = new Element("p", {
                        defaultClasses: `date-time ${field.settings.name}`,
                        placeholder: (new Date(item)).toLocaleString()
                    });
                    else child = new Element("p", {
                        defaultClasses: `date-time ${field.settings.name}`
                    });
                }
                else if (field.children === "date") {
                    if (item) child = new Element("p", {
                        defaultClasses: `date ${field.settings.name}`,
                        placeholder: (new Date(item)).toLocaleDateString()
                    });
                    else child = new Element("p", {
                        defaultClasses: `date ${field.settings.name}`
                    });
                }
                else if (field.children === "time") {
                    if (item) child = new Element("p", {
                        defaultClasses: `time ${field.settings.name}`,
                        placeholder: (new Date(item)).toLocaleTimeString()
                    });
                    else child = new Element("p", {
                        defaultClasses: `time ${field.settings.name}`
                    });
                }
                else if (field.children === "number") {
                    if (item) child = new Element("p", {
                        defaultClasses: `number ${field.settings.name}`,
                        placeholder: item
                    });
                    else child = new Element("p", {
                        defaultClasses: `number ${field.settings.name}`
                    });
                }
                else if (field.children === "boolean") {
                    child = new Element("p", {
                        defaultClasses: `boolean ${field.settings.name}`,
                        placeholder: item ? "Yes" : "No"
                    });
                }
                else if (field.children === "long-string") {
                    if (item) child = new Element("p", {
                        defaultClasses: `long-string ${field.settings.name}`,
                        placeholder: item.replace(/(?:\r\n|\r|\n)/g, '<br />')
                    });
                    else child = new Element("p", {
                        defaultClasses: `long-string ${field.settings.name}`
                    });
                }
                else {
                    if (item) child = new Element("p", {
                        defaultClasses: `string ${field.settings.name}`,
                        placeholder: item.replace(/(?:\r\n|\r|\n)/g, '<br />')
                    });
                    else child = new Element("p", {
                        defaultClasses: `string ${field.settings.name}`
                    });
                }
                this.addChild(child);
            }
        }
        else {
            foreach(this.fields.children, (field) => {
                let child = this.addChild(new ReadBox(field, true));
                child.setValue(item[field.settings.name]);
            });
        }
    }
}

class EditBox extends Element {
    constructor(fields, nested = false, loadOverride = null, extraData = null) {
        super(fields, nested);
        this.loadOverride = loadOverride;
        this.extraData = extraData;

        this.render();
    }

    render = () => {
        if (this.$div) this.$div.empty();
        else this.$div = $(`<div class="edit ${this.fields.settings.name}"></div>`);

        if (this.fields.settings.hidden) this.$div.addClass("invisible");
        if (this.nested) {
            this.$div.addClass("nested");
            if (this.fields.settings.multiple) this.$div.addClass("multiple");
        }
        
        this.renderHeader();

        this.$content = $(`<ul class="${this.fields.settings.label ? "headed" : ""} content"></ul>`).appendTo(this.$div);

        return this.$div;
    }

    static renderFieldTo = function renderFieldTo(field, $parent = this.$content, item = null, $domCapture = this.$items) {
        if (field.settings.readOnly) {
            let $rendered = ReadBox.renderFieldTo(field, $parent, item);
            $domCapture.push($rendered);
        }
        else if (field.children === "number") {
            let $editItem = null;
            if (item) $editItem = $(`<input class="${field.settings.name}" type="number" step="any" value="${item}" placeholder="${field.settings.placeholder}">`).appendTo($parent);
            else $editItem = $(`<input class="${field.settings.name}" type="number" step="any" placeholder="${field.settings.placeholder}">`).appendTo($parent);
            $domCapture.push($editItem);
        }
        else if (field.children === "options") {            
            let $editItem = $(`<select class="${field.settings.name}" id="pet-select"></select>`).appendTo($parent);
            for (let i = 0; i < field.settings.options.length; i++) {
                $(`<option class="${field.settings.name}" value="${field.settings.options[i]}">${field.settings.options[i]}</option>`).appendTo($editItem);
            }
            if (item) $editItem.find(`option:contains("${item}")`).prop('selected', true);
            else $editItem.find(`option:contains("${field.settings.placeholder}")`).prop('selected', true);
            $domCapture.push($editItem);
        }
        else if (field.children === "boolean") {
            let $editItem = $(`<input class="${field.settings.name}" type="checkbox">`).appendTo($parent);
            if (item === null) $editItem.prop('checked', field.settings.placeholder);
            else $editItem.prop('checked', item);
             
            $domCapture.push($editItem);
        }
        else if (field.children === "date-time") {
            let date = new Date(item);
            let $editItem = null;
            if (item) {
                $editItem = $(`<input class="${field.settings.name}" type="datetime-local" value="${date}">`).appendTo($parent);
            }
            else {
                let placeholder = (new Date(field.settings.placeholder - (new Date()).getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
                $editItem = $(`<input class="${field.settings.name}" type="datetime-local" value="${placeholder}">`).appendTo($parent);
            }
            $domCapture.push($editItem);
        }
        else if (field.children === "date") {
            let $editItem = null;
            if (item) {
                let date = new Date(item);
                let day = ("0" + date.getDate()).slice(-2);
                let month = ("0" + (date.getMonth() + 1)).slice(-2);
                let out = `${date.getFullYear()}-${month}-${day}`;
                $editItem = $(`<input class="${field.settings.name}" type="date" value="${out}">`).appendTo($parent);
            }
            else {
                let date = new Date(field.settings.placeholder);
                let day = ("0" + date.getDate()).slice(-2);
                let month = ("0" + (date.getMonth() + 1)).slice(-2);
                let placeholder = `${date.getFullYear()}-${month}-${day}`;
                $editItem = $(`<input class="${field.settings.name}" type="date" value="${placeholder}">`).appendTo($parent);
            }
            $domCapture.push($editItem);
        }
        else if (field.children === "time") {
            let $editItem = null;
            if (item) {
                let date = new Date(item);
                let hours = ("0" + date.getHours()).slice(-2);
                let minutes = ("0" + date.getMinutes()).slice(-2);
                let seconds = ("0" + date.getSeconds()).slice(-2);
                let out = `${hours}:${minutes}:${seconds}`;
                $editItem = $(`<input class="${field.settings.name}" type="time" value="${out}">`).appendTo($parent);
            }
            else {
                let date = new Date(field.settings.placeholder);
                let hours = ("0" + date.getHours()).slice(-2);
                let minutes = ("0" + date.getMinutes()).slice(-2);
                let seconds = ("0" + date.getSeconds()).slice(-2);
                let placeholder = `${hours}:${minutes}:${seconds}`;
                $editItem = $(`<input class="${field.settings.name}" type="time" value="${placeholder}">`).appendTo($parent);
            }
            $domCapture.push($editItem);
        }
        else if (field.children === "long-string") {
            let $editItem = null;
            if (item) $editItem = $(`<textarea class="${field.settings.name}" rows="4" placeholder="${field.settings.placeholder}">${item}</textarea>`).appendTo($parent);
            else $editItem = $(`<textarea class="${field.settings.name}" rows="4" placeholder="${field.settings.placeholder}"></textarea>`).appendTo($parent);
            $domCapture.push($editItem);
        }
        else {
            let $editItem = null;
            if (item) $editItem = $(`<input class="${field.settings.name}" type="text" placeholder="${field.settings.placeholder}" value="${item}">`).appendTo($parent);
            else $editItem = $(`<input class="${field.settings.name}" type="text" placeholder="${field.settings.placeholder}">`).appendTo($parent);
            $domCapture.push($editItem);
        }
    }

    renderHeader = () => {
        let label = this.fields.settings.label;

        if (label) {
            this.$header = $(`<h4>${this.fields.settings.label}</h4>`).appendTo(this.$div);

            if (this.nested) {
                if (this.fields.settings.multiple) {
                    if (!this.fields.settings.lockLength) {
                        this.$add = $(`<button class="add">Add</button>`).appendTo(this.$div);
                        this.$add.click(() => { this.add(); });
                    }
                }
            }
        }
    }

    save = () => {
        let toGo = [];

        if (!this.fields.settings.hidden && !this.fields.settings.readOnly) {
            if (this.fields.settings.multiple && this.nested) {
                for (let i = 0; i < this.$items.length; i++) {
                    if (this.$items[i]) {
                        let og = null;
                        if (this.item && this.item[i]) og = this.item[i];
                        let saved = this.saveFields(this.$items[i], og);
                        toGo.push(saved);
                    }
                }
            }
            else toGo = this.saveFields();
        }
        else toGo = this.item;

        return toGo;
    }

    saveFields = ($items = this.$items, originalItem = this.item) => {
        let toGo = {};

        if (Array.isArray(this.fields.children)) {
            let offset = 0;

            for (let i = 0; i < this.fields.children.length; i++) {
                if (!this.fields.children[i].settings.hidden && !this.fields.children[i].settings.readOnly) {
                    let saved = $items[i - offset].save();
                    toGo[this.fields.children[i].settings.name] = saved;
                }
                else {
                    if (originalItem && originalItem[this.fields.children[i].settings.name]) {
                        toGo[this.fields.children[i].settings.name] = originalItem[this.fields.children[i].settings.name];
                    }
                    else toGo[this.fields.children[i].settings.name] = null;
                    if (this.fields.children[i].settings.hidden) offset++;
                }
            }
        }
        else toGo = this.saveField(this.fields.children, $items[0]);   

        return toGo;
    }

    saveField = (field, $input) => {
        if (field == "string") {
            return $input.val();
        }
        else if (field === "options") {
            return $input.val();
        }
        else if (field == "long-string") {
            return $input.val();
        }
        else if (field == "number") {
            return parseFloat($input.val());
        }
        else if (field == "image") {
            return $input.val();
        }
        else if (field == "date-time") {
            return new Date($input.val()).getTime();
        }
        else if (field == "date") {
            let date = $input.val().split("-");
            return new Date(date[0], date[1] - 1, date[2]).getTime();
        }
        else if (field == "time") {
            let time = $input.val().split(" ")[0].split(":");
            let date = new Date();
            date.setHours(time[0]);
            date.setMinutes(time[1]);
            date.setSeconds(time[2]);
            return date.getTime();
        }
        else if (field == "boolean") {
            return $input.prop("checked") ? true : false;
        }
    }

    load = (item = null, fields = this.fields) => {
        this.fields = fields;
        this.$items = [];
        this.item = item;

        this.render();

        if (!this.fields.settings.hidden) {
            if (this.loadOverride) this.loadOverride(item);
            else {
                if (this.fields.settings.multiple && this.nested) {        
                    if (Array.isArray(item)) {
                        for (let i = 0; i < item.length; i++) {
                            this.add(item[i]);
                        }
                    }
        
                    if (!this.fields.settings.lockLength && this.$items.length < 1) this.add();
                }
                else this.set(item);
            }
        }
    }

    add = (item = null) => {
        this.$items.push([]);
        let $domCapture = this.$items[this.$items.length - 1];
        let $newLI = $(`<li class="${this.fields.settings.name}" id="${this.$items.length - 1}"></li>`).appendTo(this.$content);

        if (Array.isArray(this.fields.children)) {
            for (let i = 0; i < this.fields.children.length; i++) {
                let toLoad = null;
                if (item) toLoad = item[this.fields.children[i].settings.name];

                let newBox = new EditBox(this.fields.children[i], true, this.loadOverride);
                if (newBox) {
                    let $newBox = newBox.render();
                    if ($newBox) {
                        $newBox.appendTo($newLI);
                        newBox.load(toLoad);
                        $domCapture.push(newBox);
                    }
                }
            }
        }
        else EditBox.renderFieldTo(this.fields, $newLI, item, $domCapture);

        if (!this.fields.settings.lockLength) {
            let $remove = $(`<button class="remove">X</button>`).appendTo($newLI);
            let which = this.$items.length - 1;
            $remove.click(() => { this.remove(which); });
        }
    }

    set = (item) => {
        if (Array.isArray(this.fields.children)) {
            for (let i = 0; i < this.fields.children.length; i++) {
                let toLoad = null;
                if (item) toLoad = item[this.fields.children[i].settings.name];

                let newBox = new EditBox(this.fields.children[i], true, this.loadOverride);
                if (newBox) {
                    let $newBox = newBox.render();
                    if ($newBox) {
                        $newBox.appendTo(this.$content);
                        newBox.load(toLoad);
                        this.$items.push(newBox);
                    }
                }
            }
        }
        else EditBox.renderFieldTo(this.fields, this.$content, item, this.$items);
    }

    remove = (which) => {
        this.$div.find(`#${which}`).remove();
        this.$items[which] = null;
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
    constructor(fields = new NBField(), settings = {}) {
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
        this.fields = fields;
        this.state = "read";

        this.box = null;
        
        this.buttons = new BrowserButtons(this);
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

    read = (parent = this.parent) => {
        this.state = "read";
        this.parent = parent;

        this.cancelDelete();

        if (this.box?.$div) this.box.$div.remove();
        this.box = new ReadBox(this.parent.serving.fields);
        this.$div.append(this.box.$div);

        this.buttons.showButton("close");
        this.buttons.hideButton("save");
        this.buttons.hideButton("cancel");
        this.buttons.showButton("delete");

        if (this.parent.serving.editable) this.buttons.showButton("edit");
        else this.buttons.hideButton("edit");

        this.box.load(this.parent.serving.data[this.parent.serving.selected], this.parent.serving.fields);
        this.box.show();
    }

    new = (parent = this.parent) => {
        this.state = "new";
        this.parent = parent;

        if (this.box?.$div) this.box.$div.remove();
        this.box = new EditBox(this.parent.serving.fields);
        this.$div.append(this.box.$div);

        this.buttons.hideButton("edit");
        this.buttons.showButton("close");
        this.buttons.showButton("save");
        this.buttons.showButton("cancel");
        this.buttons.hideButton("delete");

        this.box.load(this.parent.serving.data[this.parent.serving.selected], this.parent.serving.fields);
    }

    edit = (parent = this.parent) => {
        this.state = "edit";
        this.parent = parent;

        if (this.box?.$div) this.box.$div.remove();
        this.box = new EditBox(this.parent.serving.fields);
        this.$div.append(this.box.$div);

        this.buttons.hidButtone("edit");
        this.buttons.showButton("close");
        this.buttons.showButton("save");
        this.buttons.showButton("cancel");
        this.buttons.hideButton("delete");

        this.box.load(this.parent.serving.data[this.parent.serving.selected], this.parent.serving.fields);

        if (this.settings.onEdit) this.settings.onEdit();
    }

    cancel = () => {
        this.read();

        if (this.settings.onCancel) this.settings.onCancel();
    }

    close = () => {
        this.hide();

        this.$div.remove();

        if (this.settings.onClose) this.settings.onClose();
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
            let browser = new this.settings.useBrowser(this.settings.id, this.serving, {
                onSave: this.save,
                onEdit: this.edit,
                onCancel: this.cancel,
                onDelete: this.delete,
                onClose: this.close
            });
            return browser;
        }
        else return null;
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

    }

    addSearchBox = () => {
        this.searchBox = new this.settings.useSearchBox({
            onLiClick: (which) => {
                this.serving.selected = which;
                let browser = this.makeBrowser();
                browser.read(this);
                browser.show();
                this.searchBox.appendToItem(browser.$div, which);
                this.searchBox.disableItem(which);
            },
            onNew: () => {
                this.serving.selected = this.serving.data.length;
                let browser = this.makeBrowser();
                browser.new(this);
                browser.show();
                this.searchBox.appendToItem(browser.$div, this.serving.selected);
                this.searchBox.disableItem(which);
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