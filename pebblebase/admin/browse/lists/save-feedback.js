import globalCrud from "./globalCrud.js";

export default async (req, user) => {
    return await globalCrud(req, user, "the-pebble-feedback", "Entry");
}