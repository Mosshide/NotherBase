export default async function viewHistory(req, user) {
    if (user.data.authLevels.includes("ITAD")) {
        let userToFind = await req.Spirit.findOne({ service: "user", "data.username": req.body.which });
        if (userToFind) {
            let page = await req.Spirit.find({ service: "it", parent: userToFind._id });

            return page;
        }
        return [];
    } else {
        return [];
    }
}