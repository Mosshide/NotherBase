const Filters = class Filters {
    constructor(onFilterChange = null) {
        this.filter = "";
        this.onFilterChange = onFilterChange;

        this.render();
    }

    render = () => {
        this.$div = $(`<div class="filters invisible"></div>`);
        this.$search = $(`<input type="text" placeholder="search">`).appendTo(this.$div);
        this.$search.on("input", (e) => { return this.setFilter(e.currentTarget.value); });
        
        return this.$div;
    }

    setFilter = (filter) => {
        this.filter = filter;
        this.$search.val(filter);
        if (this.onFilterChange) this.onFilterChange();
    }

    getFilter = () => {
        return this.filter.toLowerCase();
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
    constructor(id = null, parent) {
        this.id = id;
        this.parent = parent;

        SearchBox.attemptStyle();

        this.$div = $(`<div class="search-box" id="${id ? `#${id}` : ""}"></div>`);
        this.$searchList = $(`<ul class="selector"></ul>`).appendTo(this.$div);
        // this.buttons = new Buttons(id, [], {
        //     isTabs: true
        // });
        
        this.selected = -1;
        this.items = [];

        //this.$div.append(this.buttons.$div);
    }

    static styled = false;

    static attemptStyle() {
        if (!SearchBox.styled) {
            $("head").append(`<link href='/styles/search-box.css' rel='stylesheet' />`);
            SearchBox.styled = true;
        }
    }

    addFilters = (filters = new Filters(this.renderSearchResults)) => {
        this.filters = filters;
        this.$div.append(this.filters.$div);
    }

    renderSearchResults = () => {
        this.$searchList.empty();

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i]) {
                let label = this.items[i].name || this.items[i].username || this.items[i].title || this.items[i].header || this.items[i].whenSearched || Object.values(this.items[i])[0];
    
                if (label?.toLowerCase) {
                    if (label.toLowerCase().includes(this.filters.getFilter())) {
                        let $result = $(`<li id="${i}">${label}</li>`).appendTo(this.$searchList);
                        $result.on("click", (e) => { 
                            this.select(e.currentTarget);
                            if (this.parent) this.parent.select(i, "read", true);
                        });
                    }
                }
                else {
                    if (("Name Error").includes(this.filters.getFilter())) {
                        let $result = $(`<li id="${i}">Name Error</li>`).appendTo(this.$searchList);
                        $result.on("click", (e) => { 
                            this.select(e.currentTarget);
                            if (this.parent) this.parent.select(i, "read", true);
                        });
                    }
                }
            }
            else $(`<p>No Items</p>`).appendTo(this.$searchList);
        };
        if (this.items.length < 1) {
            this.$searchList.append(`<p>No Items</p>`);
        }
    }

    load = (data, which = null, filter = null) => {
        this.items = data;
        this.renderSearchResults();
        if (which) this.select(null, which);
        if (filter) this.filters.setFilter(filter);
        else this.filters.setFilter("");
    }

    select = (target = null, which = null) => {
        this.$searchList.children().removeClass("selected");
        if (target) $(target).addClass("selected");
        else if (which != null) $(this.$searchList.children()[which]).addClass("selected");
    }
}

