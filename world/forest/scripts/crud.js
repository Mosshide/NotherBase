export default async function (req, user, service, individual) {
    if (!req.session.currentUser) {
        return `You must be logged in to save a(n) ${individual}.`;
    }
    else if (!req.body.item?.id) {
        let spirit = await req.db.Spirit.create(service, {}, user.memory._id);
        spirit.addBackup(req.body.item.data);
        await spirit.commit();
        return { newID: spirit.memory._id, message: `created` };
    }
    else if (req.body.deleting) {
        let del = await req.db.Spirit.delete(service, user.memory._id, {}, req.body.item.id);
        return `${del} deleted.`;
    }
    else {
        let spirit = await req.db.Spirit.recallOne(service, user.memory._id, {}, req.body.item.id);
        spirit.addBackup(req.body.item.data);
        await spirit.commit();
        return `saved`;
    }
}