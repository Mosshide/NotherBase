Date.isLeapYear = function (year) { 
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () { 
    return Date.isLeapYear(this.getFullYear()); 
};

Date.prototype.getDaysInMonth = function () { 
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    let n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

Date.prototype.toWithinAMonth = function () {
    let today = new Date();
    let d = this.getDate();
    this.setDate(1);
    this.setFullYear(today.getFullYear());
    if (d >= today.getDate()) this.setMonth(today.getMonth());
    else this.setMonth(today.getMonth() + 1);
    this.setDate(Math.min(d, this.getDaysInMonth()));
    return this;
};

Date.prototype.toWithinAYear = function () {
    let today = new Date();
    let d = this.getDate();
    this.setDate(1);
    if (this.getMonth() >= today.getMonth()) this.setFullYear(today.getFullYear());
    else this.setFullYear(today.getFullYear() + 1);
    this.setDate(Math.min(d, this.getDaysInMonth()));
    return this;
}

Date.prototype.getDayOfTheWeek = function (mini = false) {
    if (mini) return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][this.getDay()];
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()];
};

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

        this.showYear = this.addChild(new CheckBox({
            header: "Show Year",
            onClick: (e, self) => { this.updateFilter(self.getValue(), "showYear"); }
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
            // update the showYear checkbox value
            this.$showYear.prop("checked", this.filter.showYear);
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

        if (this.items.length < 1) {
            this.list.$div.append(`<p>No Items</p>`);
        }
        else {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i]) {     
                    this.getWorkingDate(this.items[i]);
                    this.getWorkingDate(metaBrowser.serving.loadedData[i].data.backups[0].data);
                }
            };
            // sort the data first by if there is a date, then by date, then by time, then by name
            metaBrowser.sortData((a, b) => {
                if (!a && !b) return 0;
                if (a && !b) return -1;
                if (!a && b) return 1;
                if (a.workingDate && !b.workingDate) return -1;
                if (!a.workingDate && b.workingDate) return 1;
                if (a.workingDate && b.workingDate) {
                    if (a.workingDate > b.workingDate) return -1;
                    if (a.workingDate < b.workingDate) return 1;
                }
        
                // convert timeHours and timeMinutes to time
                if (a.timeHours && a.timeMinutes) a.time = a.timeHours + a.timeMinutes;
                if (b.timeHours && b.timeMinutes) b.time = b.timeHours + b.timeMinutes;
                if (a.time && !b.time) return -1;
                if (!a.time && b.time) return 1;
                if (a.time && b.time) {
                    if (a.time < b.time) return 1;
                    if (a.time > b.time) return -1;
                }
        
                if (a.name && !b.name) return -1;
                if (!a.name && b.name) return 1;
                if (a.name && b.name) {
                    if (a.name < b.name) return 1;
                    if (a.name > b.name) return -1;
                }
        
                return 0;
            });
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i]) {       
                    this.renderItem(this.items[i], i);
                }
                else $(`<p>Item Error</p>`).appendTo(this.list.$div);
            };
        }
    }

    getWorkingDate = (item) => {
        if (item.date) {
            item.workingDate = new Date(item.date);
    
            if (item.workingDate.getTime() < this.dayStart.getTime()) {
                if (item.frequency.toLowerCase() === "weekly") while (item.workingDate.getTime() < this.dayStart.getTime()) {
                    item.workingDate.setDate(item.workingDate.getDate() + 7);
                }
                else if (item.frequency.toLowerCase() === "monthly") {
                    item.workingDate.toWithinAMonth();
                }
                else if (item.frequency.toLowerCase() === "yearly") {
                    item.workingDate.toWithinAYear();
                }
            }
        }
    }

    extractLabel = (item) => {
        let label = null;
        label = item?.name || item?.username || item?.title || item?.header || item?.whenSearched;
        if (!label) label = "Unnamed Task";

        if (typeof label !== "string") label = String(label);

        if (item && !item.workingDate) this.getWorkingDate(item);
        if (item && item.workingDate) {
            if (item.workingDate.getTime() < this.dayStart.getTime()) {
                label = `${item.workingDate.toLocaleDateString()} - ${label}`;
            }
            else if (item.workingDate.getTime() < this.dayEnd.getTime()) {
                label = `${item.timeHours ? item.timeHours : "00"}:${item.timeMinutes ? item.timeMinutes : "00"} - ${label}`;
            }
            else if (item.workingDate.getTime() < this.weekEnd.getTime()) {
                label = `${item.workingDate.getDayOfTheWeek(true)} - ${label}`;
            }
            else if (item.workingDate.getTime() < this.monthEnd.getTime()) {
                label = `${item.workingDate.getMonth() + 1}/${item.workingDate.getDate()} - ${label}`;
            }
            else if (item.workingDate.getTime() < this.yearEnd.getTime()) {
                label = `${item.workingDate.getMonth() + 1}/${item.workingDate.getDate()} - ${label}`;
            }
            else {
                label = `${item.workingDate.toLocaleDateString()} - ${label}`;
            }
        };

        return label;
    }

    getList = (item) => {
        let list = this.todoList;

        if (item && item.workingDate) {
            if (item.workingDate.getTime() < this.dayStart.getTime()) {
                list = this.oldList;
            }
            else if (item.workingDate.getTime() < this.dayEnd.getTime()) {
                list = this.todayList;
            }
            else if (item.workingDate.getTime() < this.weekEnd.getTime()) {
                list = this.weekList;
            }
            else if (item.workingDate.getTime() < this.monthEnd.getTime()) {
                list = this.monthList;
            }
            else if (item.workingDate.getTime() < this.yearEnd.getTime()) {
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
            if (!this.filter.showYear) {
                if (list === this.yearList) filtered = true;
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
    })
]),
label: "Your Tasks",
multiple: true,
toLoad: async () => {
    return await base.loadAll("schedule");
},
toSave: async (item, deleting) => {
    return await base.do("save-task", { item, deleting });
}});