import crud from "../../../scripts/crud.js";

export default async (req, user) => {
    return await crud(req, user, "schedule");
}