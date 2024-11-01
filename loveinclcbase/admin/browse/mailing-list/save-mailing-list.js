import globalCrud from "../scripts/globalCrud.js";

export default async (req, user) => {
    return await globalCrud(req, user, "loveinclc-mailing-list", "Entry");
}