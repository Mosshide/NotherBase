class Agenda extends SearchBox {
    constructor() {
        super();
        // Add any additional constructor logic here
    }

    // Override renderSearchResults method
    renderSearchResults = function() {
        this.$searchList.empty();
        
        this.$todayHeader = $("<h4>Schedule - Today</h4>").appendTo(this.$searchList);
        console.log(this.$todayHeader);

        // for (let i = 0; i < this.items.length; i++) {
        //     if (this.items[i]) {
        //         let label = this.items[i].name || this.items[i].username || this.items[i].title || this.items[i].header || this.items[i].whenSearched || Object.values(this.items[i])[0];
    
        //         if (label?.toLowerCase) {
        //             if (label.toLowerCase().includes(this.filters.getFilter())) {
        //                 let $result = $(`<li id="${i}">${label}</li>`).appendTo(this.$searchList);
        //                 $result.on("click", (e) => { 
        //                     this.select(e.currentTarget);
        //                     if (this.settings.parent) this.settings.parent.select(i, "read", true);
        //                 });
        //             }
        //         }
        //         else {
        //             if (("Name Error").includes(this.filters.getFilter())) {
        //                 let $result = $(`<li id="${i}">Name Error</li>`).appendTo(this.$searchList);
        //                 $result.on("click", (e) => { 
        //                     this.select(e.currentTarget);
        //                     if (this.settings.parent) this.settings.parent.select(i, "read", true);
        //                 });
        //             }
        //         }
        //     }
        //     else $(`<p>No Items</p>`).appendTo(this.$searchList);
        // };
        // if (this.items.length < 1) {
        //     this.$searchList.append(`<p>No Items</p>`);
        // }
    }
}

const agenda = new Agenda("upstairs");
const browser = new Browser();
browser.hide();
const metaBrowser = new MetaBrowser(null, browser, agenda);
const weekday = ["Sun", "Mon"," Tue", "Wed", "Thu", "Fri", "Sat"];
//const weekday = ["Wednesday", "Wednesday"," Wednesday", "Wednesday", "Wednesday", "Wednesday", "Wednesday"];
const date = new Date();
let dayName = weekday[date.getDay()];
$(`<div class="date">${dayName}: ${date.toLocaleDateString()}</div>`).appendTo(metaBrowser.$div);
//get weather forecast
let $weather = $(`<div class="weather">Loading the weather outside.</div>`).appendTo(metaBrowser.$div);
$.get(`https://api.weather.gov/points/46.7253,-122.9534`, (data) => {
    if (data.properties.forecast) $.get(data.properties.forecast, (data) => {
        let current = data.properties.periods[0];
        $weather.text(`${current.name}: ${current.temperature} °F, ${current.shortForecast}, ${current.windSpeed}`);
    });
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
    }
});
metaBrowser.addService("shared-schedule", {
    fields: new NBField({
        name: "task",
        label: "Task Shared with You: ",
        placeholder: "No task",
        multiple: true
    }, [
        new NBField({
            name: "name",
            label: "Name: ",
            placeholder: "Name"
        }, "string"),
        new NBField({
            name: "from",
            label: "From: ",
            placeholder: "other"
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
            label: "Recurring: ",
            placeholder: false
        }, "boolean"),
        new NBField({
            name: "frequency",
            label: "Recurs: ",
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
                label: "Group: ",
                placeholder: "No Group",
                readOnly: true
            }, "string")
        ])
    ]),
    label: "Tasks Shared with You",
    multiple: true,
    toLoad: async () => {
        return (await base.do("load-shared-schedule")).data;
    }
});
