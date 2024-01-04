// an extension of the Filters class called AgendaFilters
// this class has a few extra filters that are specific to the agenda
class AgendaFilters extends Filters {
    constructor(onFilterChange = null) {
        super(onFilterChange, {
            search: "",
            showOld: false,
            showMore: false
        });

        this.showOld = this.addChild(new CheckBox({
            header: "Show Old",
            onClick: (e, self) => { this.updateFilter(self.getValue(), "showOld"); }
        }));

        this.showMore = this.addChild(new CheckBox({
            header: "Show More",
            onClick: (e, self) => { this.updateFilter(self.getValue(), "showMore"); }
        }));
    }

    setFilter = (filter) => {
        if (filter) {
            // update the filter
            this.updateFilter(filter, null);
            // update the search input value
            this.$search.val(this.filter.search);
            // update the showOld checkbox value
            this.$showOld.prop("checked", this.filter.showOld);
            // update the showMore checkbox value
            this.$showMore.prop("checked", this.filter.showMore);
        }
    }
}

// an extension of the SearchBox class called Agenda
// this class has a few extra lists that are specific to the agenda
class Agenda extends SearchBox {
    constructor(settings = {}) {
        super({
            defaultClasses: "search-box agenda",
            filters: null,
            ...settings
        });

        this.nowDate = new Date();

        this.dayStart = new Date(this.nowDate.getTime());
        this.dayStart.setHours(0);
        this.dayStart.setMinutes(0);
        this.dayStart.setSeconds(0);
        this.dayStart.setMilliseconds(0);

        this.dayEnd = new Date(this.nowDate.getTime());
        this.dayEnd.setHours(23);
        this.dayEnd.setMinutes(59);
        this.dayEnd.setSeconds(59);
        this.dayEnd.setMilliseconds(999);

        this.weekEnd = new Date(this.nowDate.getTime());
        this.weekEnd.setDate(this.weekEnd.getDate() + 7);
        this.weekEnd.setHours(23);
        this.weekEnd.setMinutes(59);
        this.weekEnd.setSeconds(59);
        this.weekEnd.setMilliseconds(999);

        this.monthEnd = new Date(this.nowDate.getTime());
        this.monthEnd.setMonth(this.monthEnd.getMonth() + 1);

        this.yearEnd = new Date(this.nowDate.getTime());
        this.yearEnd.setFullYear(this.yearEnd.getFullYear() + 1);

        this.addFilters(AgendaFilters, this.renderSearchResults);

        this.removeChild(this.list);

        this.oldList = this.addChild(new Element("ul", {
            defaultClasses: "selector",
            header: "Old Tasks",
            hidden: true
        }));
        this.todayList = this.addChild(new Element("ul", {
            defaultClasses: "selector",
            header: "Today",
            hidden: true
        }));
        this.todoList = this.addChild(new Element("ul", {
            defaultClasses: "selector",
            header: "To Do",
            hidden: true
        }));
        this.weekList = this.addChild(new Element("ul", {
            defaultClasses: "selector",
            header: "This Week",
            hidden: true
        }));
        this.monthList = this.addChild(new Element("ul", {
            defaultClasses: "selector",
            header: "This Month",
            hidden: true
        }));
        this.yearList = this.addChild(new Element("ul", {
            defaultClasses: "selector",
            header: "This Year",
            hidden: true
        }));
        this.moreList = this.addChild(new Element("ul", {
            defaultClasses: "selector",
            header: "More",
            hidden: true
        }));
    }

    // Override renderSearchResults method
    renderSearchResults = () => {
        this.clearLists();

        this.filter = this.filters.getValue(null);

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i]) {        
                this.renderItem(this.items[i], i);
            }
            else $(`<p>No Items</p>`).appendTo(this.list.$div);
        };
        if (this.items.length < 1) {
            this.list.$div.append(`<p>No Items</p>`);
        }
    }

    extractLabel = (item) => {
        let label = item.name || item.username || item.title || item.header || item.whenSearched || Object.values(item)[0];
        if (!label) label = "No Name";

        if (typeof label !== "string") label = label.toString();

        if (item.date) {
            let testDate = new Date(item.date);

            if (testDate.getTime() < this.dayStart.getTime()) {
                if (item.frequency.toLowerCase() === "weekly") while (testDate.getTime() < this.dayStart.getTime()) {
                    testDate.setDate(testDate.getDate() + 7);
                }
                else if (item.frequency.toLowerCase() === "monthly") {
                    testDate.toWithinAMonth();
                }
                else if (item.frequency.toLowerCase() === "yearly") {
                    testDate.toWithinAYear();
                }
            }

            if (testDate.getTime() < this.dayStart.getTime()) {
                label = `${testDate.toLocaleDateString()} - ${label}`;
            }
            else if (testDate.getTime() < this.dayEnd.getTime()) {
                label = `${item.timeHours}:${item.timeMinutes} - ${label}`;
            }
            else if (testDate.getTime() < this.weekEnd.getTime()) {
                label = `${testDate.getDayOfTheWeek(true)} - ${label}`;
            }
            else if (testDate.getTime() < this.monthEnd.getTime()) {
                label = `${testDate.getMonth() + 1}/${testDate.getDate()} - ${label}`;
            }
            else if (testDate.getTime() < this.yearEnd.getTime()) {
                label = `${testDate.getMonth() + 1}/${testDate.getDate()} - ${label}`;
            }
            else {
                label = `${testDate.toLocaleDateString()} - ${label}`;
            }
        };

        return label;
    }

    getList = (item) => {
        let list = this.todoList;

        if (item.date) {
            let testDate = new Date(item.date);

            if (testDate.getTime() < this.dayStart.getTime()) {
                if (item.frequency.toLowerCase() == "weekly") while (testDate.getTime() < this.dayStart.getTime()) {
                    testDate.setDate(testDate.getDate() + 7);
                }
                else if (item.frequency.toLowerCase() == "monthly") {
                    testDate.toWithinAMonth();
                }
                else if (item.frequency.toLowerCase() == "yearly") {
                    testDate.toWithinAYear();
                }
            }

            if (testDate.getTime() < this.dayStart.getTime()) {
                list = this.oldList;
            }
            else if (testDate.getTime() < this.dayEnd.getTime()) {
                list = this.todayList;
            }
            else if (testDate.getTime() < this.weekEnd.getTime()) {
                list = this.weekList;
            }
            else if (testDate.getTime() < this.monthEnd.getTime()) {
                list = this.monthList;
            }
            else if (testDate.getTime() < this.yearEnd.getTime()) {
                list = this.yearList;
            }
            else {
                list = this.moreList;
            }
        };

        return list;
    }

    renderItem = (item, i) => {
        let label = this.extractLabel(item);
        let list = this.getList(item);
        
        let filtered = false;
        if (this.filter) {
            if (!label.toLowerCase().includes(this.filter.search)) {
                filtered = true;
            }
            if (!this.filter.showOld) {
                if (list === this.oldList) filtered = true;
            }
            if (!this.filter.showMore) {
                if (list === this.moreList) filtered = true;
            }
        }
        if (!filtered) {
            list.show();
            return list.addChild(new Text("li", { 
                placeholder: label,
                id: i,
                onClick: (e, element) => {
                    if (this.settings.onLiClick) this.settings.onLiClick(e, element);
                }, 
                onClose: (e, element) => {
                    for (let j = 0; j < this.oldList.children.length; j++) {
                        if (this.oldList.children[j].settings.id > i) this.oldList.children[j].settings.id--;
                    }
                    for (let j = 0; j < this.todayList.children.length; j++) {
                        if (this.todayList.children[j].settings.id > i) this.todayList.children[j].settings.id--;
                    }
                    for (let j = 0; j < this.todoList.children.length; j++) {
                        if (this.todoList.children[j].settings.id > i) this.todoList.children[j].settings.id--;
                    }
                    for (let j = 0; j < this.weekList.children.length; j++) {
                        if (this.weekList.children[j].settings.id > i) this.weekList.children[j].settings.id--;
                    }
                    for (let j = 0; j < this.monthList.children.length; j++) {
                        if (this.monthList.children[j].settings.id > i) this.monthList.children[j].settings.id--;
                    }
                    for (let j = 0; j < this.yearList.children.length; j++) {
                        if (this.yearList.children[j].settings.id > i) this.yearList.children[j].settings.id--;
                    }
                    for (let j = 0; j < this.moreList.children.length; j++) {
                        if (this.moreList.children[j].settings.id > i) this.moreList.children[j].settings.id--;
                    }
                }
            }));
        }
    }

    // clears all lists
    clearLists = () => {
        if (this.browser) {
            this.browser.close();
            this.browser = null;
        }
        this.oldList.closeChildren();
        this.oldList.hide();
        this.todayList.closeChildren();
        this.todayList.hide();
        this.todoList.closeChildren();
        this.todoList.hide();
        this.weekList.closeChildren();
        this.weekList.hide();
        this.monthList.closeChildren();
        this.monthList.hide();
        this.yearList.closeChildren();
        this.yearList.hide();
        this.moreList.closeChildren();
        this.moreList.hide();
    }
}

const metaBrowser = new MetaBrowser({
    header: "Agenda",
    useSearchBox: Agenda
});
metaBrowser.render();
metaBrowser.addService("schedule", {
    fields: new NBField({
    name: "task",
    label: "Task: ",
    placeholder: "No task"
}, [
    new NBField({
        name: "name",
        placeholder: "Name",
        type: "string"
    }),
    new NBField({
        name: "date",
        placeholder: Date.now(),
        type: "date"
    }),
    new NBField({
        name: "timeHours",
        placeholder: "",
        options: [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", 
            "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"
        ],
        type: "options"
    }),
    new NBField({
        name: "timeMinutes",
        label: ":",
        placeholder: "",
        options: [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09",
            "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
            "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
            "30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
            "40", "41", "42", "43", "44", "45", "46", "47", "48", "49",
            "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"
        ],
        type: "options"
    }),
    new NBField({
        name: "frequency",
        label: "Repeats: ",
        placeholder: "Once",
        options: [
            "Once",
            "Weekly",
            "Monthly",
            "Yearly"
        ],
        type: "options"
    }),
    new NBField({
        name: "description",
        label: "Description: ",
        placeholder: "Description",
        type: "long-string"
    }),
    new NBField({
        name: "sharing",
        label: "Sharing: ",
        placeholder: "None",
        multiple: true,
        lockLength: true
    }, [
        new NBField({
            name: "id",
            hidden: true,
            readOnly: true,
            type: "string"
        }),
        new NBField({
            name: "name",
            placeholder: "No Group",
            readOnly: true,
            type: "string"
        }),
        new NBField({
            name: "shared",
            placeholder: false,
            type: "boolean"
        })
    ])
]),
label: "Your Tasks",
multiple: true,
toLoad: async () => {
    return (await base.do("load-schedule")).data;
},
toSave: async (item, which, deleting) => {
    await base.do("save-task", { item, which, deleting });
}});