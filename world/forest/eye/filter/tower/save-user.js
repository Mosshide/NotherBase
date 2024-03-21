export default async (req, user) => {
    let towerCrud = async function (service, individual) {
        if (!user.loggedIn()) {
            return `You must be logged in to save a(n) ${individual}.`;
        }
        else if (!user.data.authLevels.includes("Creator")) {
            return `You must be a Creator to save a(n) ${individual}.`;
        }
        else if (!req.body.item?.id) {
            let spirit = await req.db.Spirit.create(service, req.body.item.data, null);
            spirit.addBackup(req.body.item.data);
            await spirit.commit();
            return { newID: spirit.memory._id, message: `created` };
        }
        else if (req.body.deleting) {
            let del = await req.db.Spirit.delete(service, {}, null, req.body.item.id);
            return `${del} deleted.`;
        }
        else {
            let spirit = await req.db.Spirit.recallOne(service, null, {}, req.body.item.id);
            spirit.addBackup({
                ...spirit.memory.data.backups[0].data,
                ...req.body.item.data
            });
            // once upon a time some data got too nested and this was the fix
            // if (spirit.memory.data.backups[0].data.data.username) {
            //     spirit.memory.data.backups[0].data = {
            //         ...spirit.memory.data.backups[0].data.data,
            //         ...req.body.item.data
            //     }
            // }
            await spirit.commit();
            return `${individual} saved.`;
        }
    }
    
    if (user.data.authLevels.includes("Creator")) {
        return await towerCrud("user", "User");
    }
}