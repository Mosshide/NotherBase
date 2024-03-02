export default async (req, user) => {
    let basicGlobalCrud = async function (service, individual) {
        if (!req.body.item?.id) {
            let spirit = await req.db.Spirit.create(service, {}, null);
            spirit.addBackup(req.body.item.data);
            await spirit.commit();
            return `${individual} created.`;
        }
        else if (req.body.deleting) {
            let del = await req.db.Spirit.delete(service, {}, null, req.body.item.id);
            return `${del} deleted.`;
        }
        else {
            let spirit = await req.db.Spirit.recallOne(service, null, {}, req.body.item.id);
            spirit.addBackup(req.body.item.data);
            await spirit.commit();
            return `${individual} saved.`;
        }
    }
    return await basicGlobalCrud("portfolio-examples", "Example");
}