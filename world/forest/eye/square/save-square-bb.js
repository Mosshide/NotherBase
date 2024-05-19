import basicCrud from "../../../forest/scripts/globalCrud.js";

export default async (req, user) => {   
    // if (req.body.items.length < 7) {
    //     let spirit = await req.db.Spirit.recallOne("square-bb");

    //     await spirit.commit({ items: req.body.items });
    // }
    return await basicCrud(req, user, "square-bb", "Note");
}