class NBField {
    constructor(settings, children = null) {
        this.settings = {
            name: "default",
            label: "",
            placeholder: "",
            multiple: false,
            lockLength: false,
            readOnly: false,
            hidden: false,
            buttons: null,
            type: "object",
            ...settings
        }

        this.children = children;
    }
}

class ViewBox extends Element {
    constructor(nested = false, settings = {}) {
        super("div", {
            defaultClasses: `read ${nested ? "nested" : ""}`,
            ...settings
        });
        this.fields = {};
        this.nested = nested;
        this.item = null;
        this.editing = false;
        this.buttons = null;
        this.child = [];
    }

    setValue = (item = null, fields = this.fields, editing = this.editing) => {
        this.item = item;
        this.fields = fields;
        this.editing = editing;
        this.settings.defaultClasses = `${this.fields.settings.name}${this.editing ? " edit" : " read"}${this.nested ? " nested" : ""}${this.fields.settings.multiple ? " multiple" : ""}`;
        this.settings.header = this.fields.settings.label;
        this.closeChildren();
        this.initModifiers();
        
        if (this.fields.settings.buttons || this.fields.settings.multiple) {
            this.buttons = this.addChild(new Buttons());
            if (this.fields.settings.buttons) this.fields.settings.buttons.forEach((button) => {
                this.buttons.addButton(new Button(button.id, button.settings.onClick, button.settings));
            });
            if (this.fields.settings.multiple && this.editing && !this.fields.settings.lockLength) this.buttons.addButton(new Button("add", (e, self) => { 
                this.createChild(null, this.child.length); 
            }, { placeholder: "Add" }));
        }

        if (!Array.isArray(item)) {
            if (item !== null) item = [item];
            else item = [];
        }
        if (item.length == 0 && !this.fields.settings.lockLength) item.push(null);
        for (let i = 0; i < item.length; i++) {
            this.createChild(item[i], i);
        } 
    }

    createChild = (item, which) => {
        let child = null;

        if (this.fields.settings.type == "object") {
            child = new Element("div", { defaultClasses: `object ${this.fields.settings.name}` });
            child.child = {};
            child.getValue = () => {
                let toGo = {};

                for (let i = 0; i < this.fields.children.length; i++) {
                    toGo[this.fields.children[i].settings.name] = child.child[this.fields.children[i].settings.name].getValue();
                }

                return toGo;
            }

            for (let i = 0; i < this.fields.children.length; i++) {
                let grandChild = child.addChild(new ViewBox(true));
                child.child[this.fields.children[i].settings.name] = grandChild;
                grandChild.setValue(item ? item[this.fields.children[i].settings.name] : null, this.fields.children[i], this.editing);
            }
        }
        else {
            if (this.editing && !this.fields.settings.readOnly) {
                switch (this.fields.settings.type) {
                    case "image":
                        child = new Input("text", {
                            defaultClasses: `image ${this.fields.settings.name}`,
                            placeholder: this.fields.settings.placeholder, 
                            hidden: this.fields.settings.hidden 
                        });
                        child.setValue(item);
                        break;
                    case "number":
                        child = new Input("number", {
                            defaultClasses: `number ${this.fields.settings.name}`,
                            step: "any",
                            placeholder: this.fields.settings.placeholder, 
                            hidden: this.fields.settings.hidden 
                        });
                        child.setValue(item);
                        break;
                    case "options":
                        child = new Select({
                            defaultClasses: `pet-select ${this.fields.settings.name}`,
                            options: this.fields.settings.options,
                            placeholder: this.fields.settings.placeholder, 
                            hidden: this.fields.settings.hidden 
                        });
                        child.setValue(item);
                        break;
                    case "boolean":
                        child = new CheckBox({
                            defaultClasses: `boolean ${this.fields.settings.name}`,
                            placeholder: this.fields.settings.placeholder, 
                            hidden: this.fields.settings.hidden 
                        });
                        child.setValue(item);
                        break;
                    case "date-time":
                        if (item) item = new Date(item);
        
                        child = new Input("datetime-local", {
                            defaultClasses: `${this.fields.settings.name}`,
                            placeholder: this.fields.settings.placeholder, 
                            hidden: this.fields.settings.hidden 
                        });
                        child.setValue(item);
                        break;
                    case "date":
                        if (item) {
                            let d = new Date(item);
                            let day = ("0" + d.getDate()).slice(-2);
                            let month = ("0" + (d.getMonth() + 1)).slice(-2);
                            item = `${d.getFullYear()}-${month}-${day}`;
                        }
            
                        child = new Input("date", {
                            defaultClasses: `${this.fields.settings.name}`,
                            placeholder: this.fields.settings.placeholder, 
                            hidden: this.fields.settings.hidden 
                        });
                        child.setValue(item);
                        break;
                    case "time":
                        if (item) {
                            let date = new Date(item);
                            let hours = ("0" + date.getHours()).slice(-2);
                            let minutes = ("0" + date.getMinutes()).slice(-2);
                            let seconds = ("0" + date.getSeconds()).slice(-2);
                            item = `${hours}:${minutes}:${seconds}`;
                        }
                        child = new Input("time", {
                            defaultClasses: `${this.fields.settings.name}`,
                            placeholder: this.fields.settings.placeholder, 
                            hidden: this.fields.settings.hidden 
                        });
                        child.setValue(item);
                        break;
                    case "long-string":
                        child = new TextArea({
                            defaultClasses: `long-string ${this.fields.settings.name}`,
                            placeholder: this.fields.settings.placeholder, 
                            hidden: this.fields.settings.hidden 
                        });
                        child.setValue(item);
                        break;
                    default:
                        child = new Input("text", {
                            defaultClasses: `string ${this.fields.settings.name}`,
                            placeholder: this.fields.settings.placeholder, 
                            hidden: this.fields.settings.hidden 
                        });
                        child.setValue(item);
                        break;
                }
            }
            else {
                switch (this.fields.settings.type) {
                    case "image":
                        child = new Element("img", { defaultClasses: `image ${this.fields.settings.name}`, hidden: this.fields.settings.hidden });
                        if (item) child.settings.attributes["src"] = item;
                        else child.settings.attributes["src"] = this.fields.settings.placeholder;
                        child.setValue(item);
                        break;
                    case "number":
                        child = new Text("p", { defaultClasses: `number ${this.fields.settings.name}`, hidden: this.fields.settings.hidden  });
                        child.setValue(item);
                        break;
                    case "options":
                        child = new Text("p", { defaultClasses: `options ${this.fields.settings.name}`, hidden: this.fields.settings.hidden  });
                        child.setValue(item);
                        break;
                    case "boolean":
                        child = new Text("p", { defaultClasses: `boolean ${this.fields.settings.name}`, hidden: this.fields.settings.hidden  });
                        if (item === null) child.setValue(this.fields.settings.placeholder ? "Yes" : "No");
                        else child.setValue(item ? "Yes" : "No");
                        break;
                    case "date-time":
                        child = new Text("p", { defaultClasses: `date-time ${this.fields.settings.name}`, hidden: this.fields.settings.hidden  });
                        child.setValue((new Date(item)).toLocaleString());
                        break;
                    case "date":
                        child = new Text("p", { defaultClasses: `date ${this.fields.settings.name}`, hidden: this.fields.settings.hidden  });
                        if (item) child.setValue((new Date(item)).toLocaleDateString());
                        else child.setValue(null);
                        break;
                    case "time":
                        child = new Text("p", { defaultClasses: `time ${this.fields.settings.name}`, hidden: this.fields.settings.hidden  });
                        child.setValue((new Date(item)).toLocaleTimeString());
                        break;
                    case "long-string":
                        child = new Text("p", { defaultClasses: `long-string ${this.fields.settings.name}`, hidden: this.fields.settings.hidden  });
                        child.setValue(item);
                        break;
                    default:
                        child = new Text("p", { defaultClasses: `string ${this.fields.settings.name}`, hidden: this.fields.settings.hidden  });
                        child.setValue(item);
                        break;
                }
            }
        }
        
        if (child) {
            child.settings.defaultCSS.order = which + 2;
            child.settings.onClose = () => {
                this.child.splice(this.child.indexOf(child), 1);
                if (this.child.length == 0) this.setValue();
            }
            if (this.editing && this.fields.settings.multiple && !this.fields.settings.readOnly && this.nested && !this.fields.settings.lockLength) {
                child.removeButton = child.preChild(new Button("remove", (e, self) => { child.close(); }, { defaultClasses: "remove", placeholder: "X" }));
                child.downButton = child.preChild(new Button("down", (e, self) => { this.moveChildDown(which); }, { defaultClasses: "moveDown", placeholder: "↓ Down" }));
                child.upButton = child.preChild(new Button("up", (e, self) => { this.moveChildUp(which); }, { defaultClasses: "moveUp", placeholder: "Up ↑" }));
            }
        }

        return this.child.push(this.addChild(child));
    }

    getValue = () => {
        let toGo = [];

        for (let i = 0; i < this.child.length; i++) {
            toGo.push(this.child[i].getValue());

            if (this.fields.settings.type == "date-time") {
                toGo[toGo.length - 1] = new Date(toGo).getTime();
            }
            else if (this.fields.settings.type == "date") {
                let date = toGo[toGo.length - 1].split("-");
                toGo[toGo.length - 1] = new Date(date[0], date[1] - 1, date[2]).getTime();
            }
            else if (this.fields.settings.type == "time") {
                let time = toGo[toGo.length - 1].split(" ")[0].split(":");
                let date = new Date();
                date.setHours(time[0]);
                date.setMinutes(time[1]);
                date.setSeconds(time[2]);
                toGo[toGo.length - 1] = date.getTime();
            }
        }
        if (!this.fields.settings.multiple || !this.nested) {
            toGo = toGo[0];
        }

        return toGo;
    }

    moveChildUp = (which) => {
        if (which >= 0 && which < this.child.length) {
            if (which == 0) {
                let temp = this.child[0];
                this.child[0] = this.child[this.child.length - 1];
                this.child[0].settings.defaultCSS.order = 2;
                this.child[0].initModifiers();
                this.child[0].upButton.enable((e, self) => { this.moveChildUp(0); });
                this.child[0].downButton.enable((e, self) => { this.moveChildDown(0); });
                this.child[this.child.length - 1] = temp;
                this.child[this.child.length - 1].settings.defaultCSS.order = this.child.length + 1;
                this.child[this.child.length - 1].initModifiers();
                this.child[this.child.length - 1].upButton.enable((e, self) => { this.moveChildUp(this.child.length - 1); });
                this.child[this.child.length - 1].downButton.enable((e, self) => { this.moveChildDown(this.child.length - 1); });
            }
            else {
                let temp = this.child[which];
                this.child[which] = this.child[which - 1];
                this.child[which].settings.defaultCSS.order = which + 2;
                this.child[which].initModifiers();
                this.child[which].upButton.enable((e, self) => { this.moveChildUp(which); });
                this.child[which].downButton.enable((e, self) => { this.moveChildDown(which); });
                this.child[which - 1] = temp;
                this.child[which - 1].settings.defaultCSS.order = which + 1;
                this.child[which - 1].initModifiers();
                this.child[which - 1].upButton.enable((e, self) => { this.moveChildUp(which - 1); });
                this.child[which - 1].downButton.enable((e, self) => { this.moveChildDown(which - 1); });
            }
        }
    }

    moveChildDown = (which) => {
        if (which >= 0 && which < this.child.length) {
            if (which == this.child.length - 1) {
                let temp = this.child[this.child.length - 1];
                this.child[this.child.length - 1] = this.child[0];
                this.child[this.child.length - 1].settings.defaultCSS.order = this.child.length + 1;
                this.child[this.child.length - 1].initModifiers();
                this.child[this.child.length - 1].upButton.enable((e, self) => { this.moveChildUp(this.child.length - 1); });
                this.child[this.child.length - 1].downButton.enable((e, self) => { this.moveChildDown(this.child.length - 1); });
                this.child[0] = temp;
                this.child[0].settings.defaultCSS.order = 2;
                this.child[0].initModifiers();
                this.child[0].upButton.enable((e, self) => { this.moveChildUp(0); });
                this.child[0].downButton.enable((e, self) => { this.moveChildDown(0); });
            }
            else {
                let temp = this.child[which];
                this.child[which] = this.child[which + 1];
                this.child[which].settings.defaultCSS.order = which + 2;
                this.child[which].initModifiers();
                this.child[which].upButton.enable((e, self) => { this.moveChildUp(which); });
                this.child[which].downButton.enable((e, self) => { this.moveChildDown(which); });
                this.child[which + 1] = temp;
                this.child[which + 1].settings.defaultCSS.order = which + 3;
                this.child[which + 1].initModifiers();
                this.child[which + 1].upButton.enable((e, self) => { this.moveChildUp(which + 1); });
                this.child[which + 1].downButton.enable((e, self) => { this.moveChildDown(which + 1); });
            }
        }
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
        this.serving = serving;

        this.box = null;
        this.usingBackup = 0;
        
        this.buttons = this.addChild(new Buttons({ id: "browser-ui" }));
        this.buttons.addButton(new Button("edit", (e, self) => { this.edit(); }, { placeholder: "Edit" }));
        this.buttons.addButton(new Button("save", (e, self) => { this.save(); }, { placeholder: "Save" }));
        this.buttons.addButton(new Button("cancel", (e, self) => { this.cancel(); }, { placeholder: "Cancel" }));
        this.buttons.addButton(new Button("delete", (e, self) => { this.attemptDelete(); }, { placeholder: "Delete" }));
        this.buttons.addButton(new Button("close", (e, self) => { this.close(); this.serving.state = "search"; }, { placeholder: "Close" }));
        this.buttons.addButton(new Button("undo", (e, self) => { this.undo(); }, { placeholder: "Undo" }));
        this.buttons.addButton(new Button("redo", (e, self) => { this.redo(); }, { placeholder: "Redo" }));
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
        if (this.serving.state === "edit" || this.serving.state === "new") {
            this.item = this.box.getValue();
            
            if (this.settings.onSave) this.settings.onSave(this.item);

            this.read();
        }
    }

    read = (serving = this.serving) => {
        this.serving = serving;
        this.serving.state = "read";
        this.usingBackup = 0;

        this.cancelDelete();

        if (this.box) this.box.close();
        this.box = this.addChild(new ViewBox());
        this.box.setValue(this.serving.data[this.serving.selected], this.serving.fields, false);

        this.buttons.showButton("close");
        this.buttons.hideButton("save");
        this.buttons.hideButton("cancel");
        this.buttons.hideButton("undo");
        this.buttons.hideButton("redo");
        
        if (this.serving.editable) {
            this.buttons.showButton("edit");
            this.buttons.showButton("delete");
        }
        else this.buttons.hideButton("edit");
    }

    new = (serving = this.serving, itemOverride = null) => {
        this.serving = serving;
        this.serving.state = "new";

        if (this.box) this.box.close();
        this.box = this.addChild(new ViewBox());
        this.box.setValue(itemOverride ? itemOverride : null, this.serving.fields, true);

        this.buttons.hideButton("edit");
        this.buttons.showButton("close");
        this.buttons.showButton("save");
        this.buttons.showButton("cancel");
        this.buttons.hideButton("delete");
    }

    edit = (serving = this.serving, itemOverride = null) => {
        this.serving = serving;
        this.serving.state = "edit";
        
        if (this.box?.$div) this.box.close();
        this.box = this.addChild(new ViewBox(), false, true);
        this.box.setValue(itemOverride !== null ? itemOverride : this.serving.data[this.serving.selected], this.serving.fields, true);

        this.buttons.hideButton("edit");
        this.buttons.hideButton("close");
        this.buttons.showButton("save");
        this.buttons.showButton("cancel");
        this.buttons.hideButton("delete");
        if (this.serving.enableBackups) {
            if (this.serving.loadedData[this.serving.selected].data?.backups) {
                if (this.serving.loadedData[this.serving.selected].data.backups.length - 1 > this.usingBackup) this.buttons.showButton("undo");
            }
            if (this.usingBackup > 0) this.buttons.showButton("redo");
        }

        if (this.settings.onEdit) this.settings.onEdit();
    }

    cancel = () => {
        this.read();

        if (this.settings.onCancel) this.settings.onCancel();
    }    

    undo = () => {
        this.cancelDelete();
        this.usingBackup++;
        this.edit(this.serving, this.serving.loadedData[this.serving.selected].data.backups[this.usingBackup]?.data ? this.serving.loadedData[this.serving.selected].data.backups[this.usingBackup].data : {});
        if (this.serving.loadedData[this.serving.selected].data.backups.length - 1 <= this.usingBackup) this.buttons.hideButton("undo");
    }

    redo = () => {
        this.cancelDelete();
        this.usingBackup--;
        this.edit(this.serving, this.serving.loadedData[this.serving.selected].data.backups[this.usingBackup]?.data ? this.serving.loadedData[this.serving.selected].data.backups[this.usingBackup].data : {});
        if (this.usingBackup <= 0) this.buttons.hideButton("redo");
    }
}

class TreeBrowser extends Browser {
    constructor(serving, settings) {
        super(serving, settings);

        this.usingBackup = 0;
        
        this.buttons.enableButton("delete", (e, self) => { this.attemptDelete(); });
        this.buttons.enableButton("save", (e, self) => { this.save(); });
        this.buttons.enableButton("cancel", (e, self) => { this.read(this.serving, false); });
        this.buttons.enableButton("edit", (e, self) => { this.edit(); });
        this.buttons.addButton(new Button("up", (e, self) => {
            this.up();
        }, { placeholder: "Up" }));
        this.buttons.addButton(new Button("top", (e, self) => {
            this.top();
        }, { placeholder: "Top" }));
        this.buttons.hideButton();

        this.childButtons = this.addChild(new Buttons({ id: "child-buttons" }));
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

    delete = async () => {
        if (this.serving.itemLocation.length === 0) {
            if (this.settings.onDelete) this.settings.onDelete();
            this.close();
        }
        else {
            let index = this.serving.itemLocation[this.serving.itemLocation.length - 1];
            this.up();
            let item = this.getItemNode();
            item.children.splice(index, 1);
            await this.save();
        }
    }

    save = async () => {
        if (this.usingBackup == 0) {
            let node = this.getItemNode();
            node.data = this.box.getValue();
            this.serving.data[this.serving.selected].name = this.serving.data[this.serving.selected].data.name;
            this.serving.data[this.serving.selected].saveLocation = this.serving.itemLocation;
            
            if (this.settings.onSave) this.settings.onSave(this.serving.data[this.serving.selected]);
        }
        else if (this.usingBackup > 0) {
            let node = this.getBackupItemNode(this.usingBackup);
            node.data = this.box.getValue();
            this.serving.loadedData[this.serving.selected].data.backups[this.usingBackup].data.saveLocation = this.serving.itemLocation;
            this.serving.loadedData[this.serving.selected].data.backups[this.usingBackup].data.name = this.serving.loadedData[this.serving.selected].data.backups[this.usingBackup].data.name;

            if (this.settings.onSave) this.settings.onSave(this.serving.loadedData[this.serving.selected].data.backups[this.usingBackup].data);
        }

        this.usingBackup = 0;
        this.read(this.serving, false);
    }

    read = (serving = this.serving, resetLocation = true) => {
        this.serving = serving;
        this.serving.state = "read";
        if (resetLocation || this.usingBackup > 0) {
            this.serving.itemLocation = [];
            this.usingBackup = 0;
        }

        this.cancelDelete();

        if (this.box) this.box.close();
        this.box = this.addChild(new ViewBox());

        let item = this.getItemNode();
        this.box.setValue(item.data, this.serving.fields, false);

        this.buttons.showButton("close");
        if (this.serving.itemLocation.length > 1) this.buttons.showButton("up");
        else this.buttons.hideButton("up");
        if (this.serving.itemLocation.length > 0) this.buttons.showButton("top");
        else this.buttons.hideButton("top");
        this.buttons.hideButton("save");
        this.buttons.hideButton("cancel");
        this.buttons.hideButton("undo");
        this.buttons.hideButton("redo");
        
        if (this.serving.editable) {
            this.buttons.showButton("edit");
            this.buttons.showButton("delete");
        }
        else this.buttons.hideButton("edit");

        this.childButtons.closeChildren();
        if (!Array.isArray(item.children)) item.children = [];
        for (let i = 0; i < item.children.length; i++) {
            let child = item.children[i];
            let button = this.childButtons.addButton(new Button(child.data.name, (e, self) => {
                this.down(i);
            }, { placeholder: child.data.name }));
        }
        this.newChild = this.childButtons.addButton(new Button("new", (e, self) => {
            this.newNode();
        }, { placeholder: "New" }));
    }  

    new = (serving = this.serving, itemOverride = null) => {
        this.serving = serving;
        this.serving.state = "new";

        if (this.box) this.box.close();
        this.box = this.addChild(new ViewBox());
        this.serving.itemLocation = [];
        this.box.setValue(itemOverride ? itemOverride : {}, this.serving.fields, true);

        this.buttons.hideButton("edit");
        this.buttons.showButton("close");
        this.buttons.showButton("save");
        this.buttons.showButton("cancel");
        this.buttons.hideButton("delete");
        if (this.serving.itemLocation.length > 1) this.buttons.showButton("up");
        else this.buttons.hideButton("up");
        if (this.serving.itemLocation.length > 0) this.buttons.showButton("top");
        else this.buttons.hideButton("top");
    }

    newNode = () => {
        let item = this.getItemNode();
        if (!Array.isArray(item.children)) item.children = [];
        item.children.push({
            data: {
                name: "New Node"
            },
            children: []
        });
        this.down(item.children.length - 1);
    }

    edit = (serving = this.serving, itemOverride = null) => {
        this.serving = serving;
        this.serving.state = "edit";
        
        if (this.box?.$div) this.box.close();
        this.box = this.addChild(new ViewBox(), false, true);

        let item = this.getItemNode();
        this.box.setValue(itemOverride ? itemOverride.data : item.data, this.serving.fields, true);
        
        this.buttons.hideButton("edit");
        this.buttons.hideButton("close");
        this.buttons.showButton("save");
        this.buttons.showButton("cancel");
        this.buttons.hideButton("delete");
        if (this.serving.itemLocation.length > 1) this.buttons.showButton("up");
        else this.buttons.hideButton("up");
        if (this.serving.itemLocation.length > 0) this.buttons.showButton("top");
        else this.buttons.hideButton("top");
        if (this.serving.loadedData[this.serving.selected].data.backups.length - 1 > this.usingBackup) this.buttons.showButton("undo");
        if (this.usingBackup > 0) this.buttons.showButton("redo");

        this.childButtons.closeChildren();
        if (itemOverride) {
            if (!Array.isArray(itemOverride.children)) itemOverride.children = [];
            for (let i = 0; i < itemOverride.children.length; i++) {
                let child = itemOverride.children[i];
                let button = this.childButtons.addButton(new Button(child.data.name, (e, self) => {}, { placeholder: child.data.name }));
                button.disable();
            }
        }
        else {
            if (!Array.isArray(item.children)) item.children = [];
            for (let i = 0; i < item.children.length; i++) {
                let child = item.children[i];
                let button = this.childButtons.addButton(new Button(child.data.name, (e, self) => {}, { placeholder: child.data.name }));
                button.disable();
            }
        }

        if (this.settings.onEdit) this.settings.onEdit();
    }
    
    getItemNode = () => {
        if (!Array.isArray(this.serving.itemLocation)) this.serving.itemLocation = [];
        if (this.serving.data[this.serving.selected] === null) this.serving.data[this.serving.selected] = { data: {}, children: [] };
        if (typeof this.serving.data[this.serving.selected] !== "object") this.serving.data[this.serving.selected] = { data: this.serving.data[this.serving.selected], children: [] };
        let item = this.serving.data[this.serving.selected];
        
        for (let i = 0; i < this.serving.itemLocation.length; i++) {
            item = item.children[this.serving.itemLocation[i]];
            if (typeof item !== "object") break;
        }

        if (typeof item !== "object") item = { data: item, children: [] };
        return item;
    }

    getBackupItemNode = (backup) => {
        if (!Array.isArray(this.serving.itemLocation)) this.serving.itemLocation = [];
        if (typeof this.serving.loadedData[this.serving.selected].data.backups[backup].data !== "object") this.serving.loadedData[this.serving.selected].data.backups[backup].data = { data: this.serving.loadedData[this.serving.selected].data.backups[backup].data, children: [] };
        let item = this.serving.loadedData[this.serving.selected].data.backups[backup].data;
        for (let i = 0; i < this.serving.itemLocation.length; i++) {
            item = item.children[this.serving.itemLocation[i]];
            if (typeof item !== "object") break;
        }

        if (typeof item !== "object") item = { data: item, children: [] };
        return item;
    }

    up = () => {
        if (this.serving.itemLocation.length > 0) {
            this.serving.itemLocation.pop();
            this.read(this.serving, false);
        }
    }

    top = () => {
        this.read();
    }

    down = (index) => {
        this.serving.itemLocation.push(index);
        this.read(this.serving, false);
    }

    undo = () => {
        this.cancelDelete();
        this.usingBackup++;
        this.serving.itemLocation = this.serving.loadedData[this.serving.selected].data.backups[this.usingBackup].data?.saveLocation;
        let item = this.getBackupItemNode(this.usingBackup);
        this.edit(this.serving, item ? item : {});
        if (this.serving.loadedData[this.serving.selected].data.backups.length - 1 <= this.usingBackup) this.buttons.hideButton("undo");
    }

    redo = () => {
        this.cancelDelete();
        this.usingBackup--;
        this.serving.itemLocation = this.serving.loadedData[this.serving.selected].data.backups[this.usingBackup].data?.saveLocation;
        let item = this.getBackupItemNode(this.usingBackup);
        this.edit(this.serving, item ? item : {});
        if (this.usingBackup <= 0) this.buttons.hideButton("redo");
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
            defaultClasses: "meta",
            showFilters: true,
            ...settings
        });

        this.browser = null;
        this.searchBox = null;
        this.services = {};
        this.selectedService = "";
        this.serving = null;
        this.disabledElement = null;
        
        this.buttons = this.addChild(new Buttons());
        
        this.alert = this.addChild(new Alert());

        if (this.settings.useSearchBox) this.addSearchBox();
    }

    render() {
        this.$div = super.render(`.meta${this.settings.id ? `#${this.settings.id}` : ""}`);

        return this.$div;
    }

    setAlert = (msg) => {
        this.alert.setValue(msg);
        this.alert.show();
    }

    makeBrowser = () => {
        if (this.settings.useBrowser) {
            this.browser = new this.settings.useBrowser(this.serving, {
                onSave: this.save,
                onEdit: this.edit,
                onCancel: this.cancel,
                onDelete: this.delete,
                onClose: () => {
                    if (this.disabledElement) {
                        if (this.serving.state == "new") {
                            this.serving.data.splice(this.serving.selected, 1);
                            this.disabledElement.close();
                        }
                        else if (this.serving.state == "delete") {
                            this.disabledElement.close();
                        }
                        else  {
                            this.disabledElement.enable();
                            this.disabledElement.setValue(this.searchBox.extractLabel(this.serving.data[this.serving.selected]));
                        }
                    }
                    this.disabledElement = null;
                    this.browser = null;
                    this.serving.state = "search";
                }
            });
        }
    }

    save = async (item) => {
        this.serving.state = "read";
        this.serving.data[this.serving.selected] = item;
        if (!this.serving.loadedData[this.serving.selected]) this.serving.loadedData[this.serving.selected] = { data: { _backupsEnabled:true, backups: [] } };
        if (!this.serving.loadedData[this.serving.selected].data) this.serving.loadedData[this.serving.selected].data = { _backupsEnabled:true, backups: [] };
        this.serving.loadedData[this.serving.selected].data.backups?.unshift({ data: structuredClone(item) });
        let res = null;
        if (this.serving.toSave) res = await this.serving.toSave({
            data: item,
            id: this.serving.loadedData[this.serving.selected]?._id
        }, false);
        if (res.data?.newID) this.serving.loadedData[this.serving.selected]._id = res.data.newID;
    }

    edit = () => {
        this.serving.state = "edit";
    }

    cancel = () => {
        this.serving.state = "read";
    }

    delete = () => {
        this.serving.state = "delete";
        if (this.serving.toSave) this.serving.toSave({ 
            id: this.serving.loadedData[this.serving.selected]._id 
        }, true);
        this.serving.data.splice(this.serving.selected, 1);
        this.serving.loadedData.splice(this.serving.selected, 1);
        this.searchBox.renderSearchResults();
    }

    addSearchBox = () => {
        let settings = {
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
            }
        };
        if (!this.settings.showFilters) settings.filters = "none";
        this.searchBox = new this.settings.useSearchBox(settings);
        this.addChild(this.searchBox);
    }

    addService = (service, settings) => {
        this.services[service] = {
            selected: 0,
            state: "search",
            lastFilter: "",
            lastEdit: {},
            label: "Service",
            data: [],
            fields: new NBField(),
            editable: true,
            max: -1,
            enableBackups: true,
            toLoad: null, //async () => { return null; },
            toSave: null, //async (items, which) => { },
            ...settings
        };

        this.buttons.addButton(new Button(service, () => { this.selectService(service); }, {
            placeholder: `Switch to ${this.services[service].label ? this.services[service].label : service}`
        }));

        let keys = Object.keys(this.services);
        if (keys.length < 2) {
            this.load(service);
            this.buttons.hideButton(this.selectedService);
            this.searchBox.setItems([], null);
        }
        else this.load(service, false);
    }

    load = (service = this.selectedService, select = true) => {
        let serving = this.services[service];

        if (serving.toLoad) serving.toLoad().then((res) => {
            serving.loadedData = res;
            if (!Array.isArray(serving.loadedData)) serving.loadedData = [serving.loadedData];
            serving.data = [];
            for (let i = 0; i < serving.loadedData.length; i++) {
                if (serving.loadedData[i].data?._backupsEnabled) serving.data.push(structuredClone(serving.loadedData[i].data.backups[0].data));
                else serving.data.push(structuredClone(serving.loadedData[i].data));
            }
            if (select) this.selectService(service);
        });
    }

    sortData = (customSort = (a, b) => { return 0; }) => {
        this.serving.data.sort(customSort);
        this.serving.loadedData.sort((a, b) => { 
            a = a.data.backups[0].data;
            b = b.data.backups[0].data;
            return customSort(a, b);
         });
    }

    selectService = (service) => {
        if (this.serving) {
            if (this.serving.state == "edit" || this.serving.state == "new") {
                this.serving.lastEdit = this.browser.box.getValue();
            }
            if (this.searchBox) this.serving.lastFilter = this.searchBox.getFilters();
        }

        this.buttons.showButton(this.selectedService);
        this.selectedService = service;
        this.serving = this.services[this.selectedService];
        this.buttons.hideButton(this.selectedService);

        this.searchBox.setItems(this.serving.data, this.serving.editable ? (e, element) => {
            if (this.browser) {
                this.browser.close();
            }
            this.serving.selected = this.serving.data.length;
            this.serving.state = "new";
            let newElement = this.searchBox.addItem(null, true);
            newElement.disable();
            this.disabledElement = newElement;
            this.makeBrowser();
            this.searchBox.browser = this.browser;
            this.browser.new(this.serving);
            newElement.addChild(this.browser);
        } : null, this.serving.max);
        this.searchBox.setFilters(this.serving.lastFilter);
        
        if (this.serving.state == "edit") {
            let element = this.searchBox.list.children[this.serving.selected];
            element.disable();
            this.disabledElement = element;
            this.makeBrowser();
            this.searchBox.browser = this.browser;
            this.browser.edit(this.serving, this.serving.lastEdit);
            element.addChild(this.browser);
        }
        else if (this.serving.state == "new") {
            let element = this.searchBox.list.children[this.serving.selected];
            element.disable();
            this.disabledElement = element;
            this.makeBrowser();
            this.searchBox.browser = this.browser;
            this.browser.new(this.serving, this.serving.lastEdit);
            element.addChild(this.browser);
        }
        else if (this.serving.state == "read") {
            let element = this.searchBox.list.children[this.serving.selected];
            element.disable();
            this.disabledElement = element;
            this.makeBrowser();
            this.searchBox.browser = this.browser;
            this.browser.read(this.serving);
            element.addChild(this.browser);
        }      
    }  
}