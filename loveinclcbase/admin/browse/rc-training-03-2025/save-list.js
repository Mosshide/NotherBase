import globalCrud from "../scripts/globalCrud.js";

export default async (req, user) => {
    return await globalCrud(req, user, "rc-training-0325", "Entry");
}