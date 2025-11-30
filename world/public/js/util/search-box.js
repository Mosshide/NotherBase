// a class called Filters that can be used to filter a search box
class Filters extends Element {
    constructor(onFilterChange = null, defaults = { search: "" }, settings = {}) {
        super("div", {
            defaultClasses: "filters",
            header: "Filters",
            hidden: true,
            ...settings
        });
        this.defaults = defaults;
        this.filter = this.defaults;
        this.onFilterChange = onFilterChange;
        this.service = null;

        // add inputs for each filter based on its type
        for (let key in this.defaults) {
            if (this.defaults.hasOwnProperty(key)) {
                let filter = this.defaults[key];
                switch (typeof filter) {
                    case "string":
                        this[key] = this.addChild(new Input("text", {
                            header: key,
                            onInput: (value) => { this.updateFilter({ [key]: value }); }
                        }));
                        break;
                    case "boolean":
                        this[key] = this.addChild(new CheckBox({
                            header: key,
                            onChange: (value) => { this.updateFilter({ [key]: value }); }
                        }));
                        break;
                    case "array":
                        this[key] = this.addChild(new Select({
                            header: key,
                            options: filter.options,
                            onChange: (value) => { this.updateFilter({ [key]: value }); }
                        }));
                        break;
                }
            }
        }

        // this.search = this.addChild(new Input("text", {
        //     header: "Search",
        //     onInput: (filter) => { this.updateFilter(filter, "search"); }
        // }));
    }

    setService = async (service) => {
        // save the current filters if there is a current service
        let oldFilters = this.filter;
        if (this.service) {
            await base.save(`${this.service}-notherFilters`, "local", oldFilters);
        }

        // load the filters for the new service
        this.service = service;
        await base.load(`${this.service}-notherFilters`, "local").then((loadedFilter) => {
            // update the filter
            this.updateFilter(loadedFilter.memory?.data || this.defaults, false);
        });
    }

    // updates a specific filter or all filters if which is not null
    updateFilter = async (filter, saveToCloud = true) => {
        this.filter = { ...this.filter, ...filter };
        // if it has been set, call the onFilterChange function
        if (this.onFilterChange) this.onFilterChange();

        // update all child filters
        let keys = Object.keys(this.filter);
        for (let i = 0; i < keys.length; i++) {
            this[keys[i]].setValue(this.filter[keys[i]]);
        }

        // if saveToCloud is true, save the filter to the cloud
        if (saveToCloud) {
            await base.save(`${this.service}-notherFilters`, "local", this.filter);
        }
    }

    setDefaults = (defaults = this.defaults) => {
        this.filter = { ...this.defaults };
    }
}

class SearchBox extends Element {
    constructor(settings = {}) {
        super("div", {
            defaultClasses: "search-box",
            onNew: null,
            onLiClick: null,
            styles: "search-box",
            filters: { search: "" },
            filtersDefaults: settings.filtersDefaults || { search: "" },
            ...settings
        }); 
        
        this.browser = null;
        this.buttons = this.addChild(new Buttons());
        this.buttons.addButton(new Button("new", (e, element) => {
            this.settings.onNew();
        }, { placeholder: "New" }));
        this.buttons.addButton(new Button("toggleFilters", () => { 
            if (this.filters) this.filters.toggle(); 
        }, { placeholder: "Filters" }));

        if (this.settings.filters !== null) this.filters = this.addChild(new Filters(this.renderSearchResults, this.settings.filtersDefaults));
        else this.filters = null;
        if (this.settings.filters === "none") this.buttons.hideButton("toggleFilters");

        this.list = this.addChild(new Element("ul", {
            defaultClasses: "selector"        
        }));
    }

    extractLabel = (item) => {
        let label = null;
        
        if (typeof item === "string") label = item;
        else label = item?.name || item?.username || item?.title || 
                item?.header || item?.whenSearched || item?.note || item?.text || item?.design;
        if (!label) label = "Unnamed Item";

        if (typeof label !== "string") label = String(label);
        return label;
    }

    addFilters = (filters, onFilterChange) => {
        this.filters = this.addChild(new filters(onFilterChange));
    }

    setService = async (service, saveToCloud = true) => {
        this.service = service;
        if (this.filters) await this.filters.setService(service, saveToCloud);
    }

    getFilters = () => {
        if (this.filters) return this.filters.getValue();
        return null;
    }

    setItems = async (items, onNew = this.settings.onNew, max = -1) => {
        this.items = items;
        this.max = max;
        
        if (!Array.isArray(this.items)) this.items = [this.items];

        if (onNew && (this.max < 0 || this.items.length < this.max)) {
            this.buttons.show("new");
            this.settings.onNew = onNew;
        }
        else {
            this.buttons.hide("new");
            this.settings.onNew = null;
        }
        this.renderSearchResults();

        if (this.service) {
            let loadedFilter = await base.load(`${this.service}-notherLastSelected`, "local");
            
            return typeof loadedFilter?.memory?.data?.selected == "number" ? loadedFilter.memory.data.selected : -1;
        }
        else return -1;
    }

    renderSearchResults = () => {
        if (this.browser) {
            this.browser.close();
            this.browser = null;
        }
        this.list.closeChildren();

        this.filter = this.filters ? this.filters.filter : {};

        for (let i = 0; i < this.items.length; i++) {
            this.renderItem(this.items[i], i);
        };
        if (this.items.length < 1) {
            this.list.addChild(new Element("p", { 
                placeholder: "No Items"
            }));
        }

        if (this.settings.onNew && (this.max < 0 || this.items.length < this.max)) {
            this.buttons.show("new");
        }
        else {
            this.buttons.hide("new");
        }
    }

    addItem = (item = {}, newItem = false) => {
        this.items.push(item);

        if (this.settings.onNew && (this.max < 0 || this.items.length < this.max)) {
            this.buttons.show("new");
        }
        else {
            this.buttons.hide("new");
        }

        return this.renderItem(item, this.items.length - 1, newItem);
    }

    renderItem = (item, i, newItem = false) => {
        let label = this.extractLabel(item);
        
        if (label.toLowerCase().includes(this.filter.search) || newItem) {
            return this.list.addChild(new Text("li", { 
                placeholder: label,
                id: i,
                onClick: (e, element) => {
                    if (this.settings.onLiClick) this.settings.onLiClick(e, element);
                }
            }));
        }
    }

    getliElementById = (id) => {
        return this.list.children.find((child) => child.settings.id == id);
    }
}