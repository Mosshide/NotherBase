export default async function (req, user) {
    console.log(user.memory.data.backups[1]);
    if (user.memory.data.backups[0].data.authLevels.includes("Creator")) {
        let spirit = await req.db.Spirit.recallOne(`tree-projector`);
    
        await spirit.commit({
            url: req.body.url
        });
    }
}