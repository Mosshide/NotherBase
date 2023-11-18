class BrowserButtons extends Buttons {
    constructor(id, browser) {
        super(id, [
            new Button("new", {
                onClick: () => { browser.new(); },
                label: "New"
            }),
            new Button("edit", {
                onClick: () => { browser.edit(); },
                label: "Edit"
            }),
            new Button("save", {
                onClick: () => { browser.save(); },
                label: "Save"
            }),
            new Button("cancel", {
                onClick: () => { browser.cancel(); },
                label: "Cancel"
            }),
            new Button("delete", {
                onClick: () => { browser.attemptDelete(); },
                label: "Delete"
            })
        ], {
            isTabs: true
        });
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

class ViewBox {
    constructor(fields, nested = false) {
        ViewBox.attemptStyle();
        this.$div = null;
        this.hidden = false;
        this.fields = fields;
        this.$items = [];
        this.nested = nested;
    }

    static styled = false;

    static attemptStyle() {
        if (!ViewBox.styled) {
            $("head").append(`<link href='/styles/browser.css' rel='stylesheet' />`);
            ViewBox.styled = true;
        }
    }

    render = () => { /* override this */ }

    save = () => { /* override this */ }

    load = (item) => { /* override this */ }

    show = () => {
        this.$div.removeClass("invisible");
        this.hidden = false;
    }

    hide = () => {
        this.$div.addClass("invisible");
        this.hidden = true;
    }

    toggle = () => {
        if (this.hidden) this.show();
        else this.hide();
    }
}

class ReadBox extends ViewBox {
    constructor(fields, nested) {
        super(fields, nested);
    }

    render = () => {
        this.$div = $(`<div class="read ${this.fields.settings.name}"></div>`);

        if (this.fields.settings.hidden) this.$div.addClass("invisible");
        if (this.nested) this.$div.addClass("nested");
        if (this.fields.settings.multiple) this.$div.addClass("multiple");

        this.renderHeader();
        this.renderButtons();
        
        return this.$div;
    }

    renderHeader = () => {
        let mods = "";
        if (this.fields.children === "long-string") mods += "long-string ";
        if (this.fields.children === "image") mods += "image ";

        if (this.fields.settings.label) {
            if (this.nested) {
                if (this.multiple) this.$header = $(`<h5 class="${mods}${this.fields.settings.name}">${this.fields.settings.label}</h5>`).appendTo(this.$div);
                else this.$header = $(`<h6 class="${mods}${this.fields.settings.name}">${this.fields.settings.label}</h6>`).appendTo(this.$div);
            } 
            else this.$header = $(`<h4 class="${mods}${this.fields.settings.name}">${this.fields.settings.label}</h4>`).appendTo(this.$div);
        }
    }

    renderButtons = () => {
        if (Array.isArray(this.fields.settings.buttons)) {
            for (let i = 0; i < this.fields.settings.buttons.length; i++) {
                this.fields.settings.buttons[i].render();
                this.$div.append(this.fields.settings.buttons[i].$div.clone(true));
            }
        }
    }

    static renderFieldTo = function renderFieldTo(field, $parent = this.$div, item = null) {
        let $rendered = null;

        if (field.children === "image") {
            if (item) $rendered = $(`<img class="image ${field.settings.name}" src="${item}">`).appendTo($parent);
            else $rendered = $(`<img class="image ${field.settings.name}" src="${field.settings.placeholder}">`).appendTo($parent);
        }
        else if (field.children === "date-time") {
            if (item) $rendered = $(`<p class="${field.settings.name}">${(new Date(item)).toLocaleString()}</p>`).appendTo($parent);
            else $rendered = $(`<p class="${field.settings.name}"></p>`).appendTo($parent);
        }
        else if (field.children === "date") {
            if (item) $rendered = $(`<p class="${field.settings.name}">${(new Date(item)).toLocaleDateString()}</p>`).appendTo($parent);
            else $rendered = $(`<p class="${field.settings.name}"></p>`).appendTo($parent);
        }
        else if (field.children === "time") {
            if (item) $rendered = $(`<p class="${field.settings.name}">${(new Date(item)).toLocaleTimeString()}</p>`).appendTo($parent);
            else $rendered = $(`<p class="${field.settings.name}"></p>`).appendTo($parent);
        }
        else if (field.children === "number") {
            if (item) $rendered = $(`<p class="${field.settings.name}">${item}</p>`).appendTo($parent);
            else $rendered = $(`<p class="${field.settings.name}"></p>`).appendTo($parent);
        }
        else if (field.children === "boolean") {
            $rendered = $(`<p class="${field.settings.name}">${item}</p>`).appendTo($parent);
        }
        else if (field.children === "long-string") {
            if (item) $rendered = $(`<p class="long-string ${field.settings.name}">${item.replace(/(?:\r\n|\r|\n)/g, '<br />')}</p>`).appendTo($parent);
            else $rendered = $(`<p class="long-string ${field.settings.name}"></p>`).appendTo($parent);
        }
        else {
            //console.log(item, $parent);
            if (item) $rendered = $(`<p class="${field.settings.name}">${item.replace(/(?:\r\n|\r|\n)/g, '<br />')}</p>`).appendTo($parent);
            else $rendered = $(`<p class="${field.settings.name}"></p>`).appendTo($parent);
        }

        if (field.settings.hidden) $rendered.addClass("invisible");

        return $rendered;
    }

    load = (item = null, fields = this.fields) => {
        if (this.item != item || this.fields != fields) {
            this.fields = fields;
            this.item = item;
    
            this.$div.empty();  
            this.renderHeader();
            this.renderButtons();

            if (item) {
                if (this.fields.settings.multiple && this.nested) {
                    if (Array.isArray(item)) for (let i = 0; i < item.length; i++) {
                        this.add(item[i]);
                    }
                }
                else this.set(item);
            }
            else ReadBox.renderFieldTo(this.fields, this.$div, item);
        }
    }

    add = (item = null) => {
        let $newLI = $(`<li id="${this.$items.length}"></li>`).appendTo(this.$div);

        if (Array.isArray(this.fields.children)) {
            for (let i = 0; i < this.fields.children.length; i++) {
                let toLoad = null;
                if (item) toLoad = item[this.fields.children[i].settings.name];

                let newBox = new ReadBox(this.fields.children[i], true);
                if (newBox) {
                    let $newBox = newBox.render();
                    if ($newBox) {
                        $newBox.appendTo($newLI);
                        newBox.load(toLoad);
                        this.$items.push($newBox);
                    }
                }
            }
        }
        else ReadBox.renderFieldTo(this.fields, $newLI, item);
    }

    set = (item) => {
        if (Array.isArray(this.fields.children)) {
            for (let i = 0; i < this.fields.children.length; i++) {
                let toLoad = null;
                if (item) toLoad = item[this.fields.children[i].settings.name];

                let newBox = new ReadBox(this.fields.children[i], true);
                if (newBox) {
                    let $newBox = newBox.render();
                    if ($newBox) {
                        $newBox.appendTo(this.$div);
                        newBox.load(toLoad);
                    }
                }
            }
        }
        else ReadBox.renderFieldTo(this.fields, this.$div, item);
    }
}

class EditBox extends ViewBox {
    constructor(fields, nested = false, loadOverride = null, extraData = null) {
        super(fields, nested);
        this.loadOverride = loadOverride;
        this.extraData = extraData;
    }

    render = () => {
        if (!this.fields.settings.hidden) {
            if (this.nested) {
                if (this.fields.settings.multiple) {
                    this.$div = $(`<div class="edit nested multiple ${this.fields.settings.name}"></div>`);
                }
                else this.$div = $(`<div class="edit nested ${this.fields.settings.name}"></div>`);
            }
            else this.$div = $(`<div class="edit ${this.fields.settings.name}"></div>`);
    
            this.renderHeader();
    
            this.load(null);
    
            return this.$div;
        }
    }

    static renderFieldTo = function renderFieldTo(field, $parent = this.$div, item = null, $domCapture = this.$items) {
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

        if (this.nested) {
            if (this.fields.settings.multiple) {
                if (!label) label = "";
                this.$header = $(`<h6>${this.fields.settings.label}</h6>`).appendTo(this.$div);
                if (!this.fields.settings.lockLength) {
                    this.$add = $(`<button class="add">Add</button>`).appendTo(this.$header);
                    this.$add.click(() => { this.add(); });
                }
            }
            else if (label) this.$header = $(`<h6>${this.fields.settings.label}</h6>`).appendTo(this.$div);
        } 
        else if (label) this.$header = $(`<h4>${this.fields.settings.label}</h4>`).appendTo(this.$div);
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
        this.$div.empty();
        this.$items = [];
        this.item = item;

        if (!this.fields.settings.hidden) {
            if (this.loadOverride) this.loadOverride(item);
            else {
                this.renderHeader();
        
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
        let $newLI = $(`<li class="${this.fields.settings.name}" id="${this.$items.length - 1}"></li>`).appendTo(this.$div);

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
                        $newBox.appendTo(this.$div);
                        newBox.load(toLoad);
                        this.$items.push(newBox);
                    }
                }
            }
        }
        else EditBox.renderFieldTo(this.fields, this.$div, item, this.$items);
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
class Browser {
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
    constructor(id, fields = new NBField(), settings = {}) {
        this.id = id;
        this.fields = fields;
        this.editable = false;
        this.settings = {
            onSave: null,
            onEdit: null,
            onCancel: null,
            onDelete: null,
            disableSave: false,
            ...settings
        };

        this.readBox = new ReadBox(this.fields);
        this.editBox = new EditBox(this.fields, false);
        this.buttons = new BrowserButtons(id, this);
        this.buttons.hide();

        Browser.attemptStyle();
        this.render();
    }

    static styled = false;

    static attemptStyle() {
        if (!Browser.styled) {
            $("head").append(`<link href='/styles/browser.css' rel='stylesheet' />`);
            Browser.styled = true;
        }
    }

    render = () => {
        this.$div = $(`.browser${this.id ? `#${this.id}` : ""}`);

        //read box
        this.readBox.render().appendTo(this.$div);

        //edit box
        let $edit = this.editBox.render();
        this.editBox.hide();
        $edit.appendTo(this.$div);

        this.$div.append(this.buttons.$div);
    }

    save = async () => {
        this.item = this.editBox.save();
        
        if (this.settings.onSave) this.settings.onSave(this.item);

        this.read();
    }

    read = (item = this.item, parent = this.parent, fields = this.fields, editable = this.editable) => {
        this.item = item;
        this.parent = parent;
        this.fields = fields;
        this.editable = editable;

        this.editBox.hide();

        this.buttons.hide("save");
        this.buttons.hide("cancel");

        if (this.editable) this.buttons.show("edit");
        else this.buttons.hide("edit");

        this.readBox.show();

        this.readBox.load(this.item, this.fields);
    }

    edit = (item = this.item, parent = this.parent, fields = this.fields, editable = this.editable) => {
        this.editable = editable;

        if (this.editable) {
            this.item = item;
            this.parent = parent;
            this.fields = fields;
    
            this.readBox.hide();

            this.buttons.hide("edit");
            this.buttons.show("save");
            this.buttons.show("cancel");
            this.editBox.show();
    
            this.editBox.load(item, this.fields);

            if (this.settings.onEdit) this.settings.onEdit();
        }
    }

    cancel = () => {
        this.editBox.hide();

        this.buttons.hide("save");
        this.buttons.hide("cancel");

        if (this.editable) this.buttons.show("edit");
        else this.buttons.hide("edit");

        this.readBox.show();

        if (this.settings.onCancel) this.settings.onCancel();
    }
}

class TreeBrowser {
    constructor(id, fields = new NBField(), settings = {}) {
        this.id = id;
        this.fields = fields;
        this.editable = false;
        this.settings = {
            onSave: null,
            onEdit: null,
            onCancel: null,
            disableSave: false,
            ...settings
        };

        this.readBox = new ReadBox(this.fields);
        this.editBox = new EditBox(this.fields, false);
        this.buttons = new BrowserButtons(id, this);
        this.buttons.hide();

        Browser.attemptStyle();
        this.render();
    }

    /**
     * Indicates whether the browser has been styled or not.
     * @type {boolean}
     */
    static styled = false;

    /**
     * Attempts to add a stylesheet to the head of the document if it hasn't been added already.
     * @returns {void}
     */
    static attemptStyle() {
        if (!Browser.styled) {
            $("head").append(`<link href='/styles/browser.css' rel='stylesheet' />`);
            Browser.styled = true;
        }
    }

    /**
     * Renders the ReadBoxes or EditBoxes on the Browser.
     * @function
     * @returns {void}
     */
    render = () => {
        this.$div = $(`.browser${this.id ? `#${this.id}` : ""}`);

        //read box
        this.readBox.render().appendTo(this.$div);

        //edit box
        let $edit = this.editBox.render();
        this.editBox.hide();
        $edit.appendTo(this.$div);

        this.$div.append(this.buttons.$div);
    }

    /**
     * Saves the edited item and triggers onSave event.
     * @async
     */
    save = async () => {
        this.onSave();
        
        this.item = this.editBox.save();
        
        if (this.settings.onSave) this.settings.onSave(this.item);

        this.read();
    }

    attemptDelete = () => {
        this.buttons.delete.$div.empty();
        this.buttons.delete.disable();

        this.serving.lastAttempt = Date.now();

        this.$cancel = $(`<button id="cancel-delete">Cancel</button>`).appendTo(this.buttons.delete.$div);
        this.$cancel.on("click", (e) => {
            this.cancelDelete();
            e.stopPropagation();
        });

        this.$confirm = $(`<button id="confirm-delete">Confirm Delete</button>`).appendTo(this.buttons.delete.$div);
        this.$confirm.on("click", (e) => {
            if (Date.now() - this.serving.lastAttempt > 1000) {
                this.delete();
                e.stopPropagation();
            }
        });
    }

    cancelDelete = () => {
        this.buttons.delete.$div.empty();
        this.buttons.delete.$div.text("Delete");
        this.buttons.delete.enable();
    }

    delete = async () => {
        if (this.settings.onDelete) this.settings.onDelete();

        this.clear();
    }

    clear = () => {
        this.item = {};
        this.readBox.load({}, this.fields);
    }

    /**
     * Reads the item and displays it in read mode.
     * @param {Object} [item=this.item] - The item to be read.
     * @param {Object} [parent=this.parent] - The parent object of the Browser.
     * @param {Array} [fields=this.fields] - The fields to be displayed.
     * @param {boolean} [editable=this.editable] - Whether the item is editable or not.
     */
    read = (item = this.item, parent = this.parent, fields = this.fields, editable = this.editable) => {
        this.onRead();
        
        this.item = item;
        this.parent = parent;
        this.fields = fields;
        this.editable = editable;

        this.editBox.hide();

        this.buttons.hide("save");
        this.buttons.hide("cancel");

        if (this.editable) this.buttons.show("edit");
        else this.buttons.hide("edit");

        this.readBox.show();

        this.readBox.load(this.item, this.fields);
    }

    /**
     * Edits the item with the given parameters.
     * @param {Object} [item=this.item] - The item to be edited.
     * @param {Object} [parent=this.parent] - The parent object of the Browser.
     * @param {Array} [fields=this.fields] - The fields of the item to be edited.
     * @param {boolean} [editable=this.editable] - Whether the item is editable or not.
     */
    edit = (item = this.item, parent = this.parent, fields = this.fields, editable = this.editable) => {
        this.onEdit();
        
        this.editable = editable;

        if (this.editable) {
            this.item = item;
            this.parent = parent;
            this.fields = fields;
    
            this.readBox.hide();

            this.buttons.hide("edit");
            this.buttons.hide("new");
            this.buttons.show("save");
            this.buttons.show("cancel");
            this.editBox.show();
    
            this.editBox.load(item, this.fields);

            if (this.settings.onEdit) this.settings.onEdit();
        }
    }

    /**
     * Calls the edit function with an empty object.
     */
    new = () => {
        this.edit({}, this.parent, this.fields, this.editable);
    }

    /**
     * Function to cancel the edit operation and revert back to read mode.
     * @function cancel
     * @returns {void}
     */
    cancel = () => {
        this.onCancel();

        this.editBox.hide();

        this.buttons.hide("save");
        this.buttons.hide("cancel");

        if (this.editable) this.buttons.show("edit");
        else this.buttons.hide("edit");

        this.readBox.show();

        if (this.settings.onCancel) this.settings.onCancel();
    }

    /**
     * Hides the div by adding the "invisible" class to it.
     * @function
     */
    hide = () => {
        this.$div.addClass("invisible");
    }

    /**
     * Shows the div element by removing the "invisible" class.
     * @function
     */
    show = () => {
        this.$div.removeClass("invisible");
    }

    /**
     * Function called when saving data.
     * @function
     */
    onSave = () => {}

    /**
     * Function called when reading data.
     * @function
     */
    onRead = () => {}

    /**
     * Function called when editing data.
     * @function
     */
    onEdit = () => {}

    /**
     * Function called when cancelling edits.
     * @function
     */
    onCancel = () => {}
}

//

class MetaBrowser extends Buttons {
    /**
     * Represents a browser utility for browsing and managing services.
     * @constructor
     * @param {string} [label="Browse"] - The label for the browser.
     * @param {Object} [browser=null] - The browser object.
     * @param {Object} [searchBox=null] - The search box object.
     * @param {string} [id=null] - The ID for the browser.
     */
    constructor(label = "Browse", browser = null, searchBox = null, id = null) {
        super(id, {}, {
            $origin: $(`.meta.buttons${id ? `#${id}` : ""}`),
            label: label
        });

        this.services = {};
        this.browser = browser;
        this.browser.settings.onSave = this.save;
        this.browser.settings.onEdit = this.edit;
        this.browser.settings.onCancel = this.cancel;
        this.browser.settings.onDelete = this.delete;
        this.searchBox = searchBox;
        this.selectedService = "";

        this.$alert = $(`<p class="alert invisible"></p>`).appendTo(this.$div);
    }

    setAlert = (msg) => {
        this.$alert.text(msg);
        this.$alert.removeClass("invisible");
    }

    new = () => {
        if (this.serving.editable) {
            console.log(this.serving.data.length);
            this.select(this.serving.data.length, "edit", true, true);
        }
    }

    delete = async (which = this.serving.selected) => {
        if (this.serving.editable) {
            this.$confirm.off();
            
            if (this.serving.multiple) {
                if (this.serving.toSave) await this.serving.toSave(this.serving.data[this.serving.selected], this.serving.selected, true);
                if (this.serving.selected < this.serving.data.length && this.serving.selected >= 0) this.serving.data.splice(which, 1);
            }
            else {
                if (this.serving.toSave) await this.serving.toSave(this.serving.data, this.serving.selected, true);
                this.serving.data = null;
            }

            this.updateSearch();
            this.cancelDelete();

            this.select(0, "read", true, true);
        }
    }

    save = async (item) => {
        if (this.serving.editable) {
            if (this.serving.multiple) this.serving.data[this.serving.selected] = item;
            else this.serving.data = item;

            this.updateSearch();
    
            if (this.serving.toSave) await this.serving.toSave(item, this.serving.selected);

            this.serving.state = "read";
        }
    }

    edit = async () => {
        this.serving.state = "edit";
    }

    cancel = async () => {
        this.select(this.serving.selected, "read");
    }

    select = (which = 0, state = this.serving.state, passToBrowser = false, passToSearch = false) => {
        this.serving.selected = which;
        this.serving.state = state;
        if (passToBrowser) this.updateBrowser(which, state);
        if (passToSearch) this.searchBox.select(null, this.serving.selected);
    }

    updateBrowser = (which = 0, state = this.serving.state) => {
        if (state == "read") {
            if (this.serving.multiple) {
                if (this.serving.data.length > 0) {
                    if (which >= 0 && which < this.serving.data.length) {
                        this.browser.read(this.serving.data[which], this, this.serving.fields, this.serving.editable);
                    }
                    else this.browser.read(null, this, this.serving.fields, this.serving.editable);
                }
                else this.browser.read(null, this, this.serving.fields, this.serving.editable);
            }
            else this.browser.read(this.serving.data, this, this.serving.fields, this.serving.editable);
        }
        else if (state === "edit") {
            this.browser.edit(this.serving.lastEdit, this, this.serving.fields, this.serving.editable);
        }
    }

    updateStatus = (text) => {
        if (!this.$status) this.$status = $(`<p></p>`).appendTo(this.$div);
        
        this.$status.text(text);
    }

    updateSearch = () => {
        if (this.searchBox) {
            if (this.serving.multiple) this.searchBox.load(this.serving.data, this, this.serving.selected, this.serving.lastFilter);
            else this.searchBox.load([ this.serving.data ], this, this.serving.lastFilter);
            this.serving.lastFilter = "";
        }
    }

    addService = (service, settings) => {
        this.services[service] = {
            selected: 0,
            state: "read",
            lastFilter: "",
            lastEdit: {},
            label: null,
            data: null,
            fields: new NBField(),
            editable: false,
            multiple: false,
            toLoad: null, //async () => { return null; },
            toSave: null, //async (items, which) => { },
            ...settings
        };

        let serving = this.services[service];

        if (serving.multiple) serving.data = [];

        if (serving.toLoad) serving.toLoad().then((res) => {
            serving.data = res;
            
            if (serving.multiple && !Array.isArray(serving.data)) serving.data = [];

            this.addButton(new Button(service, {
                onClick: () => {
                    this.selectService(service);
                },
                label: `Switch to ${serving.label ? serving.label : service}`
            }));
    
            if (Object.keys(this.services)[0] === service) {
                this.selectedService = service;
                this.serving = this.services[this.selectedService];
                this.selectService(service);
            }
        });
    }

    reload = (service = this.selectedService) => {
        let serving = this.services[service];

        if (serving.toLoad) serving.toLoad().then((res) => {
            serving.data = res;
            if (serving.multiple && !Array.isArray(serving.data)) serving.data = [];
            this.selectService(service);
        });
    }

    selectService = (service) => {
        if (this.serving.state === "edit") this.serving.lastEdit = this.browser.editBox.save();
        if (this.serving.multiple) this.serving.lastFilter = this.searchBox.filters.getFilter();

        this.buttons[this.selectedService].show();

        this.selectedService = service;
        this.serving = this.services[this.selectedService];

        this.buttons[service].hide();

        this.updateSearch();
        this.select(this.serving.selected, this.serving.state, true, true);
    }
}