//import crud from /world/forerst/scripts/crud.js
import globalCrud from "../../forest/scripts/crud.js"

export default async (req, user) => {
    return await globalCrud("orders", "Order");
}