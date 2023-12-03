export default async (req, user) => {
    //check if logged in
    if (user.id) {
        //get the document in the database
        let spirit = await req.db.Spirit.recallOne("schedule", user.id);

        //normalize the document's data
        if (!Array.isArray(spirit.memory.data)) spirit.memory.data = [];
    
        //delete if requested
        if (req.body.deleting) {
            //check that deletion is valid
            if (req.body.which > -1 && req.body.which < spirit.memory.data.length) {
                //delete
                spirit.memory.data.splice(req.body.which, 1);
            }
        }
        else {
            //check that a valid item was sent
            if (req.body.item) {
                //edit or add a new item
                spirit.memory.data[req.body.which] = req.body.item;
            }
        }

        // sort the data first by if there is a date, then by date, then by time, then by name
        spirit.memory.data.sort((a, b) => {
            if (a.date && !b.date) return -1;
            if (!a.date && b.date) return 1;
            if (a.date && b.date) {
                if (a.date < b.date) return -1;
                if (a.date > b.date) return 1;
            }

            // convert timeHours and timeMinutes to time
            if (a.timeHours && a.timeMinutes) a.time = a.timeHours + a.timeMinutes;
            if (a.time && !b.time) return -1;
            if (!a.time && b.time) return 1;
            if (a.time && b.time) {
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;
            }


            if (a.name && !b.name) return -1;
            if (!a.name && b.name) return 1;
            if (a.name && b.name) {
                if (a.name < b.name) return 1;
                if (a.name > b.name) return -1;
            }


            return 0;
        });

        //save the document in the database
        await spirit.commit();
    }
}