import basicCrud from "../../../../forest/scripts/crud.js";

export default async (req, user) => {
    return await basicCrud(req, user, `kitchen-${req.body.part}`, "Item");
}