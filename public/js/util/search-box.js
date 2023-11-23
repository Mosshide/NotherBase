const Filters = class Filters {
    constructor(onFilterChange = null, defaults = { search: "" }) {
        this.defaults = defaults;
        this.filter = { ...this.defaults };
        this.onFilterChange = onFilterChange;

        this.render();
    }

    render = () => {
        // create the base div
        this.$div = $(`<div class="filters invisible"></div>`);
        // create the search header and append it to the base div
        this.$searchHeader = $(`<h4>Search</h4>`).appendTo(this.$div);
        // create the search input and append it to the base div
        this.$search = $(`<input type="text" placeholder="search">`).appendTo(this.$div);
        // enable the search input to update the filter
        this.$search.on("input", (e) => { return this.updateFilter("search", e.currentTarget.value); });
        
        return this.$div;
    }

    setFilter = (filter) => {
        // update the filter
        this.updateFilter(null, filter);
        // update the search input value
        this.$search.val(this.filter.search);
    }

    updateFilter = (which, filter) => {
        if (!which) {
            this.filter = filter;
            if (!this.filter) this.filter = { ...this.defaults };
        }
        else {
            // set the filter to the input value
            this.filter[which] = filter;
            // if the filter is null, set it to default
            if (!this.filter[which]) this.filter[which] = this.defaults[which];
        }

        // if it has been set, call the onFilterChange function
        if (this.onFilterChange) this.onFilterChange();
    }

    getFilter = (which = null) => {
        if (which) {
            // normalize the filter and return it
            return this.filter[which].toLowerCase();
        }
        else {
            return this.filter;
        }
    }

    show = () => {
        this.$div.removeClass("invisible");
    }

    hide = () => {
        this.$div.addClass("invisible");
    }

    toggle = () => {
        this.$div.toggleClass("invisible");
    }
}

class SearchBox {
    constructor(id = null, parent, filters = new Filters(this.renderSearchResults)) {
        this.id = id;
        this.parent = parent;
        this.filters = null;

        SearchBox.attemptStyle();

        this.$div = $(`<div class="search-box" id="${id ? `#${id}` : ""}"></div>`);
        this.$searchList = $(`<ul class="selector"></ul>`).appendTo(this.$div);
        
        this.selected = -1;
        this.items = [];

        this.addFilters(filters);
    }

    static styled = false;

    static attemptStyle() {
        if (!SearchBox.styled) {
            $("head").append(`<link href='/styles/search-box.css' rel='stylesheet' />`);
            SearchBox.styled = true;
        }
    }

    addFilters = (filters) => {
        if (filters) {
            this.filters = filters;
            this.$div.append(this.filters.$div);
        }
    }

    renderSearchResults = () => {
        this.$searchList.empty();

        let filter = this.filters.getFilter("search");

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i]) {
                let label = this.items[i].name || this.items[i].username || this.items[i].title || this.items[i].header || this.items[i].whenSearched || Object.values(this.items[i])[0];
                if (!label) label = "Name Error";

                let filtered = false;
                if (!label.toLowerCase().includes(filter)) {
                    filtered = true;
                }
                if (!filtered) this.appendToList(label, i);
            }
            else $(`<p>No Items</p>`).appendTo(this.$searchList);
        };
        if (this.items.length < 1) {
            this.$searchList.append(`<p>No Items</p>`);
        }
    }

    appendToList = (label, i) => {
        let $result = $(`<li id="${i}">${label}</li>`).appendTo(this.$searchList);
        $result.on("click", (e) => { 
            this.select(e.currentTarget);
            if (this.parent) this.parent.select(i, "read", true);
        });
        return $result;
    }

    load = (data, which = null, filter = null) => {
        this.items = data;
        this.renderSearchResults();
        if (which) this.select(null, which);
        if (this.filters) {
            this.filters.setFilter(filter);
        }
    }

    select = (target = null, which = null) => {
        this.$searchList.children().removeClass("selected");
        if (target) $(target).addClass("selected");
        else if (which != null) $(this.$searchList.children()[which]).addClass("selected");
    }

    hide = () => {
        this.$div.addClass("invisible");
    }

    show = () => {
        this.$div.removeClass("invisible");
    }
}

