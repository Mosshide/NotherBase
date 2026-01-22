import crud from "../scripts/crud.js";

export default async (req, user) => {
    if (user.data.authLevels.includes("ITAD")) {
        let userToFind = await req.Spirit.findOne({ service: "user", "data.username": req.body.which });
        if (userToFind) return await crud(req, userToFind, "it");
        else return "not found";
    } else {
        return "unauthorized";
    }
}