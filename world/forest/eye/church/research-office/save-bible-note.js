export default async (req, user) => {
    //check if logged in
    if (user.id) {
        //get the document in the database
        let spirit = await req.db.Spirit.recallOne("bible-notes", user.id);

        //normalize the document's data
        if (!Array.isArray(spirit.memory.data)) spirit.memory.data = [];
    
        //delete if requested
        if (req.body.deleting) {
            //check that deletion is valid
            if (req.body.which > -1 && req.body.which < spirit.memory.data.length) {
                //delete
                console.log("deleting", spirit.memory.data, req.body.which);
                spirit.memory.data.splice(req.body.which, 1);
                console.log("deleted", spirit.memory.data, req.body.which);
            }
        }
        else {
            //check that a valid item was sent
            if (req.body.item) {
                //edit or add a new item
                spirit.memory.data[req.body.which] = req.body.item;
            }
        }

        //save the document in the database
        await spirit.commit();
    }
}