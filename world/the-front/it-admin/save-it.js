import basicCrud from "../../forest/scripts/crud.js";

export default async (req, user) => {
    let userToFind = await req.db.Spirit.recallOne("user", null, { email: req.body.which });
    if (userToFind) return await basicCrud(req, userToFind, "it", "Entry");
    else return "not found";
}