import globalCrud from "../scripts/globalCrud.js"

export default async (req, user) => {
    if (!user?.data.authLevels.includes("SHIRTSAD")) return { message: "You do not have permission to save shirt orders." };
    return await globalCrud(req, user, "shirt-orders", "Order");
}