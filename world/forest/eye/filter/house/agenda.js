class Agenda extends SearchBox {
    constructor() {
        super();
        // Add any additional constructor logic here
    }

    // Override renderSearchResults method
    renderSearchResults() {
        this.$searchList.empty();

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i]) {
                let label = this.items[i].name || this.items[i].username || this.items[i].title || this.items[i].header || this.items[i].whenSearched || Object.values(this.items[i])[0];
    
                if (label?.toLowerCase) {
                    if (label.toLowerCase().includes(this.filters.getFilter())) {
                        let $result = $(`<li id="${i}">${label}</li>`).appendTo(this.$searchList);
                        $result.on("click", (e) => { 
                            this.select(e.currentTarget);
                            if (this.settings.parent) this.settings.parent.select(i, "read", true);
                        });
                    }
                }
                else {
                    if (("Name Error").includes(this.filters.getFilter())) {
                        let $result = $(`<li id="${i}">Name Error</li>`).appendTo(this.$searchList);
                        $result.on("click", (e) => { 
                            this.select(e.currentTarget);
                            if (this.settings.parent) this.settings.parent.select(i, "read", true);
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

    // Override select method
    select() {
        this.$searchList.children().removeClass("selected");
        if (target) $(target).addClass("selected");
        else if (which != null) $(this.$searchList.children()[which]).addClass("selected");
    }

    // Add any additional methods or properties here
}
