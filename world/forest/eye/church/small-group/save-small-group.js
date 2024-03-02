export default async (req, user) => {
    let basicCrud = async function (service, individual) {
        if (!user.loggedIn()) {
            return `You must be logged in to save a(n) ${individual}.`;
        }
        else if (!req.body.item?.id) {
            let spirit = await req.db.Spirit.create(service, {}, user.id);
            spirit.addBackup(req.body.item.data);
            await spirit.commit();
            return `${individual} created.`;
        }
        else if (req.body.deleting) {
            let del = await req.db.Spirit.delete(service, {}, user.id, req.body.item.id);
            return `${del} deleted.`;
        }
        else {
            let spirit = await req.db.Spirit.recallOne(service, user.id, {}, req.body.item.id);
            spirit.addBackup(req.body.item.data);
            await spirit.commit();
            return `${individual} saved.`;
        }
    }
    return await basicCrud("small-group", "Group");
}