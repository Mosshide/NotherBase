export default async (req, user) => {
    let dayStart = new Date();
    dayStart.setHours(0);
    dayStart.setMinutes(0);
    dayStart.setSeconds(0);
    dayStart.setMilliseconds(0);

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
        if (d > today.getDate()) this.setMonth(today.getMonth());
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

    let schedule = await req.db.Spirit.recallOne("schedule", user.id);

    for (let i = 0; i < schedule.memory.data.length; i++) {
        if (schedule.memory.data[i].date) {
            schedule.memory.data[i].workingDate = new Date(schedule.memory.data[i].date);

            if (schedule.memory.data[i].workingDate.getTime() < dayStart.getTime()) {
                if (schedule.memory.data[i].frequency.toLowerCase() === "weekly") while (schedule.memory.data[i].workingDate.getTime() < dayStart.getTime()) {
                    schedule.memory.data[i].workingDate.setDate(schedule.memory.data[i].workingDate.getDate() + 7);
                }
                else if (schedule.memory.data[i].frequency.toLowerCase() === "monthly") {
                    schedule.memory.data[i].workingDate.toWithinAMonth();
                }
                else if (schedule.memory.data[i].frequency.toLowerCase() === "yearly") {
                    schedule.memory.data[i].workingDate.toWithinAYear();
                }
            }
        }
    }

    // sort the data first by if there is a date, then by date, then by time, then by name
    schedule.memory.data.sort((a, b) => {
        if (a.workingDate && !b.workingDate) return 1;
        if (!a.workingDate && b.workingDate) return -1;
        if (a.workingDate && b.workingDate) {
            if (a.workingDate < b.workingDate) return 1;
            if (a.workingDate > b.workingDate) return -1;
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

        if (a.name && !b.name) return 1;
        if (!a.name && b.name) return -1;
        if (a.name && b.name) {
            if (a.name < b.name) return 1;
            if (a.name > b.name) return -1;
        }

        return 0;
    });

    for (let i = 0; i < schedule.memory.data.length; i++) schedule.memory.data[i].workingDate = null;

    await schedule.commit();

    return schedule.memory.data;
}