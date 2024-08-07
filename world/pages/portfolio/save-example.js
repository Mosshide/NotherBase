import crud from "../../forest/scripts/globalCrud.js";

export default async (req, user) => {
    return await crud(req, user, "portfolio-examples", "Example");
}