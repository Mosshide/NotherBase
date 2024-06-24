export default async function viewHistory(req, user) {
    let userToFind = await req.db.Spirit.recallOne("user", null, { email: req.body.which });
    let page = await req.db.Spirit.recallAll("it", userToFind.memory._id);

    return page;
}