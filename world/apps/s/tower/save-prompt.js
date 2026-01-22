import basicCrud from "../../../scripts/globalCrud.js";

export default async (req, user) => {
    return await basicCrud(req, user, "cards-against-Bible-prompts", "Prompt");
}