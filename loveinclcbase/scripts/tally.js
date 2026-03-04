export default async (req, user) => {
    let spirit = await req.Spirit.findOne({ service: "stats" });
    if (spirit) {
        let date = new Date();

        if (!spirit.data.tally) spirit.data.tally = {};

        req.session.tallied ?  null : req.session.tallied = true;
        
        if (!spirit.data.tally[req.session.id]) spirit.data.tally[req.session.id] = { 
            month: date.getUTCMonth(),
            year: date.getUTCFullYear(),
            time: 3000,
            lastAdd: 0,
            lastMonth: {
                month: null,
                year: null,
                time: null
            }
        };
        else {
            if (spirit.data.tally[req.session.id].month === date.getUTCMonth() && spirit.data.tally[req.session.id].year === date.getUTCFullYear()) {
                spirit.data.tally[req.session.id].time += 3000;
            }
            else {
                spirit.data.tally[req.session.id].lastMonth = {
                    month: spirit.data.tally[req.session.id].month,
                    year: spirit.data.tally[req.session.id].year,
                    time: spirit.data.tally[req.session.id].time
                };
                spirit.data.tally[req.session.id].month = date.getUTCMonth();
                spirit.data.tally[req.session.id].year = date.getUTCFullYear();
                spirit.data.tally[req.session.id].time = 3000;
            }
        }

        await spirit.commit();
    }
}