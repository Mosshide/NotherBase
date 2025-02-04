export default async (req, user) => {
    let spirit = await req.db.Spirit.recallOne("stats", null);
    if (spirit) {
        let date = new Date();

        if (!spirit.memory.data.tally) spirit.memory.data.tally = {};

        req.session.tallied ?  null : req.session.tallied = true;
        
        if (!spirit.memory.data.tally[req.session.id]) spirit.memory.data.tally[req.session.id] = { 
            month: date.getUTCMonth(),
            year: date.getUTCFullYear(),
            time: 3000,
            lastMonth: {
                month: null,
                year: null,
                time: null
            }
        };
        else {
            if (spirit.memory.data.tally[req.session.id].month === date.getUTCMonth() && spirit.memory.data.tally[req.session.id].year === date.getUTCFullYear()) {
                spirit.memory.data.tally[req.session.id].time += 3000;
            }
            else {
                spirit.memory.data.tally[req.session.id].lastMonth = {
                    month: spirit.memory.data.tally[req.session.id].month,
                    year: spirit.memory.data.tally[req.session.id].year,
                    time: spirit.memory.data.tally[req.session.id].time
                };
                spirit.memory.data.tally[req.session.id].month = date.getUTCMonth();
                spirit.memory.data.tally[req.session.id].year = date.getUTCFullYear();
                spirit.memory.data.tally[req.session.id].time = 3000;
            }
        }

        await spirit.commit();
    }
}