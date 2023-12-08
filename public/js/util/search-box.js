class SearchInput extends Element {
    constructor(onInput = null, settings = {}) {
        super("input", {
            defaultClasses: "search",
            onInput: onInput,
            placeholder: "Search",
            ...settings
        });
    }
}

class SearchFilter extends Element {
    constructor(onInput = null, settings = {}) {
        super("div", {
            defaultClasses: "search-filter",
            header: "Search",
            ...settings
        });
        this.onInput = onInput;

        this.addChild(new SearchInput(this.onInput));
    }
}

// a class called Filters that can be used to filter a search box
class Filters extends Element {
    constructor(onFilterChange = null, defaults = { search: "" }, settings = {}) {
        super("div", {
            defaultClasses: "filters",
            header: "Filters",
            ...settings
        });
        this.defaults = defaults;
        this.filter = this.defaults;
        this.onFilterChange = onFilterChange;

        this.search = this.addChild(new SearchFilter((filter) => this.updateFilter(filter, "search")));
    }

    setValue = (filter, which = "search") => {
        // update the filter
        this.updateFilter(filter, which);

        // update all child filters
        let keys = Object.keys(this.filter);
        for (let i = 0; i < keys.length; i++) {
            this[keys[i]].setValue(this.filter[keys[i]]);
        }
    }

    getValue = (which = "search") => {
        return this.filter[which];
    }

    // updates a specific filter or all filters if which is not null
    updateFilter = (filter, which = null) => {
        if (which) this.filter[which] = filter;
        else this.filter = filter;

        // if it has been set, call the onFilterChange function
        if (this.onFilterChange) this.onFilterChange();
    }

    setDefaults = (defaults = this.defaults) => {
        this.filter = { ...this.defaults };
    }
}

class SearchButtons extends Buttons {
    constructor(searchBox, settings = {}) {
        super({
            ...settings
        });

        this.addButton(new Button("new", searchBox.new, { placeholder: "New" }));
        this.addButton(new Button("toggleFilters", () => { if (searchBox.filters) searchBox.filters.toggle(); }, { placeholder: "Filters" }));
    }
}

class SearchBox extends Element {
    constructor(settings = {}) {
        super("div", {
            defaultClasses: "search-box open",
            onNew: null,
            onLiClick: null,
            styles: "search-box",
            filters: "default",
            ...settings
        }); 
        
        this.buttons = this.addChild(new SearchButtons(this));
        if (this.settings.filters === "default") this.filters = this.addChild(new Filters(this.renderSearchResults));
        else if (this.settings.filters) this.filters = this.addChild(this.settings.filters(this.renderSearchResults));
        else this.filters = null;
        this.list = this.addChild(new List({
            onClick: (i) => {
                if (this.settings.onLiClick) this.settings.onLiClick(i);
            },
            defaultClasses: "selector"        
        }));
    }

    setFilters = (filters) => {
        if (this.filters) this.filters.setValue(filters);
    }

    getFilters = () => {
        if (this.filters) return this.filters.getValue();
        return null;
    }

    setItems = (items, onNew = this.settings.onNew) => {
        this.items = items;
        if (!Array.isArray(this.items)) this.items = [this.items];

        if (onNew) this.buttons.show("new");
        else this.buttons.hide("new");
        this.renderSearchResults();
    }

    renderSearchResults = () => {
        this.list.$div.empty();

        let filter = this.filters.getValue("search");

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i]) {
                let label = this.items[i].name || this.items[i].username || this.items[i].title || this.items[i].header || this.items[i].whenSearched || Object.values(this.items[i])[0];
                if (!label) label = "Name Error";

                let filtered = false;
                if (!label.toLowerCase().includes(filter)) {
                    filtered = true;
                }
                if (!filtered) this.list.addItem(label);
            }
        };
        if (this.items.length < 1) {
            this.list.addChild(new Element("p", { placeholder: "No Items" }));
        }
    }

    new = () => {
        if (this.onNew) this.onNew();
    }

    getEdits = () => {
    }
}