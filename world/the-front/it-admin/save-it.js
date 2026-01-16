import basicCrud from "../../forest/scripts/crud.js";

export default async (req, user) => {
    if (user.memory.data.authLevels.includes("ITAD")) {
        let userToFind = await req.db.Spirit.recallOne("user", null, { username: req.body.which });
        if (userToFind) return await basicCrud(req, userToFind, "it", "Entry");
        else return "not found";
    } else {
        return "unauthorized";
    }
}