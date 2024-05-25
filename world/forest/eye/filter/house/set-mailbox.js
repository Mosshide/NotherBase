export default async (req, user) => {
    //check if logged in
    if (req.session.currentUser) {
        //get the document in the database
        let spirit = await req.db.Spirit.recallOne("house-mailbox", user.memory._id);

        //normalize the document's data
        if (!spirit.memory.data) spirit.memory.data = {};
    
        //check that a valid item was sent
        if (req.body.item) {
            //save the document in the database
            await spirit.commit(req.body.item); 
        }
    }
}