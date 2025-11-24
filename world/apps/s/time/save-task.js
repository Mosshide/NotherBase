import basicCrud from "../../scripts/crud.js";

export default async (req, user) => {
    return await basicCrud(req, user, "schedule", "Task");
}