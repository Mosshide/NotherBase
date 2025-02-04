export default async (req, user) => {
    if (!req.session.visitsReportLast) req.session.visitsReportLast = 0;

    if (Date.now() - req.session.visitsReportLast < 60000) return "Please wait before sending another email.";
    else {
        let spirit = await req.db.Spirit.recallOne("stats", null);
        if (spirit) {        
            // iterate through all the sessions in the tally data and total the time and count for this month and last month
            let date = new Date();
            let month = date.getUTCMonth();
            let year = date.getUTCFullYear();
    
            let thisMonthCount = 0;
            let thisMonthTime = 0;
    
            let lastMonthCount = 0;
            let lastMonthTime = 0;
    
            if (!spirit.memory.data.tally) spirit.memory.data.tally = {};
            else {
                for (let key in spirit.memory.data.tally) {
                    // normalize the data
                    spirit.memory.data.tally[key] = {
                        month: date.getUTCMonth(),
                        year: date.getUTCFullYear(),
                        time: 30000,
                        lastAdd: 0,
                        lastMonth: {
                            month: null,
                            year: null,
                            time: null
                        },
                        ...spirit.memory.data.tally[key]
                    };

                    let relevant = false;
                    // if the session is from this month, add the time to this month's total
                    if (spirit.memory.data.tally[key].month === month && spirit.memory.data.tally[key].year === year) {
                        thisMonthCount++;
                        thisMonthTime += spirit.memory.data.tally[key].time;
                        relevant = true;
                    }
                    if (spirit.memory.data.tally[key].lastMonth.month === month && spirit.memory.data.tally[key].lastMonth.year === year) {
                        thisMonthCount++;
                        thisMonthTime += spirit.memory.data.tally[key].lastMonth.time;
                        relevant = true;
                    }
                    // if the session is from last month, add the time to last month's total
                    if ((spirit.memory.data.tally[key].month === month - 1 && spirit.memory.data.tally[key].year === year) ||
                        (spirit.memory.data.tally[key].month === 11 && spirit.memory.data.tally[key].year === year - 1 && month === 0)) {
                        lastMonthCount++;
                        lastMonthTime += spirit.memory.data.tally[key].time;
                        relevant = true;
                    }
                    if ((spirit.memory.data.tally[key].lastMonth.month === month - 1 && spirit.memory.data.tally[key].lastMonth.year === year) ||
                        (spirit.memory.data.tally[key].lastMonth.month === 11 && spirit.memory.data.tally[key].lastMonth.year === year - 1 && month === 0)) {
                        lastMonthCount++;
                        lastMonthTime += spirit.memory.data.tally[key].lastMonth.time;
                        relevant = true;
                    }

                    if (!relevant) delete spirit.memory.data.tally[key];
                }
            }
    
            await spirit.commit();
    
            await req.db.SendMail.send(req.body.email, `Love INC of Lewis County Visits Report`, `
                <h1>Love INC of Lewis County Website Visits</h1>
                <h4>These numbers are estimates and are not exact.</h4> <br>
                <h3>Last Month:</h3>
                Total Visitors: ${lastMonthCount} <br>
                Average Total Time per Visitor: ${(lastMonthCount > 0 ? (lastMonthTime / 1000) / lastMonthCount : 0).toFixed(2)} seconds <br> <br>
                <h3>This Month So Far:</h3>
                Total Visitors: ${thisMonthCount} <br>
                Average Total Time per Visitor: ${(thisMonthCount > 0 ? (thisMonthTime / 1000) / thisMonthCount : 0).toFixed(2)} seconds <br>
                <br>
                <br>
                <br>
                <br>
                <p>This is an automated message. Please do not reply.</p>
            `, "Love INC of Lewis County");
        
            req.session.visitsReportLast = Date.now();
            return "Email sent.";
        }
    }
}