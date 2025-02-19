import globalCrud from "../../forest/scripts/globalCrud.js"

export default async (req, user) => {
    if (!user?.memory.data.authLevels.includes("SHIRTSAD")) return { message: "You do not have permission to save shirt inventory." };
    else return await globalCrud(req, user, "shirt-inventory", "Item");
}