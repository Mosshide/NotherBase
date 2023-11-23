export default async (req, user) => {
    //check if logged in
    if (user.id) {
        //get the document in the database
        let spirit = await req.db.Spirit.recallOne("todo-today", user.id);

        //check that a valid item was sent
        if (Array.isArray(req.body.items)) {
            //save the document in the database
            await spirit.commit({ items: req.body.items });
        }
    }
}