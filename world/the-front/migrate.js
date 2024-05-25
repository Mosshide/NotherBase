export default async (req, user) => {
    let spirit = await req.db.Spirit.recallAll("user");

    for (let i = 0; i < spirit.length; i++) {
        if (spirit[i].memory.data?._backupsEnabled) {
            spirit[i].memory.backups = spirit[i].memory.data.backups;
            spirit[i].memory.data = spirit[i].memory.backups[0].data;
            spirit[i].memory.markModified("backups");
            await spirit[i].commit();
        }
    }
}