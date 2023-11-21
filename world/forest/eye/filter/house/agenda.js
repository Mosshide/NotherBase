class Agenda extends SearchBox {
    constructor(id = null, parent) {
        super(id, parent);
        //this.addFilters(new Filters(this.renderSearchResults));

        this.$oldList = $(`<ul class="selector"></ul>`).appendTo(this.$div);
        this.$todayList = $(`<ul class="selector"></ul>`).appendTo(this.$div);
        this.$todoList = $(`<ul class="selector"></ul>`).appendTo(this.$div);
        this.$weekList = $(`<ul class="selector"></ul>`).appendTo(this.$div);
        this.$monthList = $(`<ul class="selector"></ul>`).appendTo(this.$div);
        this.$yearList = $(`<ul class="selector"></ul>`).appendTo(this.$div);
        this.$moreList = $(`<ul class="selector"></ul>`).appendTo(this.$div);
    }

    // Override renderSearchResults method
    renderSearchResults = () => {
        let nowDate = new Date();

        let dayStart = new Date(nowDate.getTime());
        dayStart.setHours(0);
        dayStart.setMinutes(0);
        dayStart.setSeconds(0);
        dayStart.setMilliseconds(0);

        let dayEnd = new Date(nowDate.getTime());
        dayEnd.setHours(23);
        dayEnd.setMinutes(59);
        dayEnd.setSeconds(59);
        dayEnd.setMilliseconds(999);

        let weekEnd = new Date(nowDate.getTime());
        weekEnd.setDate(weekEnd.getDay() + 7);
        weekEnd.setHours(23);
        weekEnd.setMinutes(59);
        weekEnd.setSeconds(59);
        weekEnd.setMilliseconds(999);

        let monthEnd = new Date(nowDate.getTime());
        monthEnd.setDate(15);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(0);
        monthEnd.setHours(23);
        monthEnd.setMinutes(59);
        monthEnd.setSeconds(59);
        monthEnd.setMilliseconds(999);

        let yearEnd = new Date(nowDate.getTime());
        yearEnd.setFullYear(yearEnd.getFullYear() + 1);
        yearEnd.setMonth(0);
        yearEnd.setDate(0);
        yearEnd.setHours(23);
        yearEnd.setMinutes(59);
        yearEnd.setSeconds(59);
        yearEnd.setMilliseconds(999);

        this.clearLists();
        
        this.$todayHeader = $("<h4>Schedule - Today</h4>").appendTo(this.$searchList);

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i]) {
                let label = this.items[i].name || this.items[i].username || this.items[i].title || this.items[i].header || this.items[i].whenSearched || Object.values(this.items[i])[0];
                let $list = this.$todoList;
                let header = "To Do";
                
                if (this.items[i].date) {
                    let testDate = new Date(this.items[i].date);

                    if (this.items[i].frequency === "weekly") while (testDate.getTime() < dayStart.getTime()) {
                        testDate.setDate(testDate.getDate() + 7);
                    }
                    else if (this.items[i].frequency === "monthly") {
                        while (testDate.getTime() < dayStart.getTime()) {
                            testDate.setFullYear(dayEnd.getFullYear());
                            testDate.setMonth(testDate.getMonth() + 1);
                        }
                        
                    }
                    else if (this.items[i].frequency === "yearly") while (testDate.getTime() < dayStart.getTime()) {
                        testDate.setFullYear(testDate.getFullYear() + 1);
                    }

                    if (testDate.getTime() < dayStart.getTime()) {
                        $list = this.$oldList;
                        header = "Old Tasks";
                    }
                    else if (testDate.getTime() < dayEnd.getTime()) {
                        $list = this.$todayList;
                        header = "Today";
                    }
                    else if (testDate.getTime() < weekEnd.getTime()) {
                        $list = this.$weekList;
                        header = "This Week";
                    }
                    else if (testDate.getTime() < monthEnd.getTime()) {
                        $list = this.$monthList;
                        header = "This Month";
                    }
                    else if (testDate.getTime() < yearEnd.getTime()) {
                        $list = this.$yearList;
                        header = "This Year";
                    }
                    else {
                        $list = this.$moreList;
                        header = "More";
                    }
                };


                if (label?.toLowerCase && label.toLowerCase().includes(this.filters.getFilter())) {
                    let $result = this.appendToList($list, label, i, header);
                }
                else if (("Name Error").includes(this.filters.getFilter())) {
                    let $result = this.appendToList($list, "Name Error", i, header);
                }
            }
            else $(`<p>No Items</p>`).appendTo(this.$searchList);
        };
        if (this.items.length < 1) {
            this.$searchList.append(`<p>No Items</p>`);
        }
    }

    clearLists = () => {
        this.$searchList.empty();
        this.$searchList.addClass("invisible");
        this.$oldList.empty();
        this.$oldList.addClass("invisible");
        this.$todayList.empty();
        this.$todayList.addClass("invisible");
        this.$todoList.empty();
        this.$todoList.addClass("invisible");
        this.$weekList.empty();
        this.$weekList.addClass("invisible");
        this.$monthList.empty();
        this.$monthList.addClass("invisible");
        this.$yearList.empty();
        this.$yearList.addClass("invisible");
        this.$moreList.empty();
        this.$moreList.addClass("invisible");
    }

    appendToList = ($list, label, i, header) => {
        if ($list.children().length < 1) {
            $list.append(`<h4>${header}</h4>`);
            $list.removeClass("invisible");
        }
        let $result = $(`<li id="${i}">${label}</li>`).appendTo($list);
        $result.on("click", (e) => { 
            this.select(e.currentTarget);
            if (this.parent) this.parent.select(i, "read", true);
        });
        return $result;
    }
}

const metaBrowser = new MetaBrowser({
    label: null,
    useSearchBox: Agenda
});
metaBrowser.addService("schedule", {
    fields: new NBField({
    name: "task",
    label: "Task: ",
    placeholder: "No task",
    multiple: true
}, [
    new NBField({
        name: "name",
        label: "Name: ",
        placeholder: "Name"
    }, "string"),
    new NBField({
        name: "date",
        label: "Date: ",
        placeholder: Date.now()
    }, "date"),
    new NBField({
        name: "time",
        label: "Time: ",
        placeholder: Date.now()
    }, "time"),
    new NBField({
        name: "recurring",
        label: "Repeat Task: ",
        placeholder: false
    }, "boolean"),
    new NBField({
        name: "frequency",
        label: "Frequency: ",
        placeholder: " ",
        options: [
            " ",
            "weekly",
            "monthly",
            "yearly"
        ]
    }, "options"),
    new NBField({
        name: "description",
        label: "Description: ",
        placeholder: "Description"
    }, "long-string"),
    new NBField({
        name: "sharing",
        label: "Sharing: ",
        placeholder: "None",
        multiple: true,
        lockLength: true
    }, [
        new NBField({
            name: "id",
            hidden: true
        }, "string"),
        new NBField({
            name: "name",
            placeholder: "No Group",
            readOnly: true
        }, "string"),
        new NBField({
            name: "shared",
            label: "Shared: ",
            placeholder: false
        }, "boolean")
    ])
]),
label: "Your Tasks",
editable: true,
multiple: true,
toLoad: async () => {
    return (await base.do("load-schedule")).data;
},
toSave: async (item, which, deleting) => {
    await base.do("save-task", { item, which, deleting });
}});
// metaBrowser.addService("shared-schedule", {
//     fields: new NBField({
//         name: "task",
//         label: "Task Shared with You: ",
//         placeholder: "No task",
//         multiple: true
//     }, [
//         new NBField({
//             name: "name",
//             label: "Name: ",
//             placeholder: "Name"
//         }, "string"),
//         new NBField({
//             name: "from",
//             label: "From: ",
//             placeholder: "other"
//         }, "string"),
//         new NBField({
//             name: "date",
//             label: "Date: ",
//             placeholder: Date.now()
//         }, "date"),
//         new NBField({
//             name: "time",
//             label: "Time: ",
//             placeholder: Date.now()
//         }, "time"),
//         new NBField({
//             name: "recurring",
//             label: "Recurring: ",
//             placeholder: false
//         }, "boolean"),
//         new NBField({
//             name: "frequency",
//             label: "Recurs: ",
//             placeholder: " ",
//             options: [
//                 " ",
//                 "weekly",
//                 "monthly",
//                 "yearly"
//             ]
//         }, "options"),
//         new NBField({
//             name: "description",
//             label: "Description: ",
//             placeholder: "Description"
//         }, "long-string"),
//         new NBField({
//             name: "sharing",
//             label: "Sharing: ",
//             placeholder: "None",
//             multiple: true,
//             lockLength: true
//         }, [
//             new NBField({
//                 name: "id",
//                 hidden: true
//             }, "string"),
//             new NBField({
//                 name: "name",
//                 label: "Group: ",
//                 placeholder: "No Group",
//                 readOnly: true
//             }, "string")
//         ])
//     ]),
//     label: "Tasks Shared with You",
//     multiple: true,
//     toLoad: async () => {
//         return (await base.do("load-shared-schedule")).data;
//     }
// });
