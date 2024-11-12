export default async function (req, user, service, individual) {
    if (!req.body.item?.id) {
        let spirit = await req.db.Spirit.create(service, {}, null);
        spirit.addBackup(req.body.item.data);
        await spirit.commit();
        return { newID: spirit.memory._id, message: `created` };
    }
    else if (req.body.deleting) {
        let del = await req.db.Spirit.delete(service, null, {}, req.body.item.id);
        return `deleted.`;
    }
    else {
        let spirit = await req.db.Spirit.recallOne(service, null, {}, req.body.item.id);
        spirit.addBackup(req.body.item.data);
        await spirit.commit();
        return `saved`;
    }
}