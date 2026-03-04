export default async function (req, user) {
    if (user.memory.data.authLevels.includes("Creator")) {
        let spirit = await req.db.Spirit.recallOne(`sanctuary-projector`);
    
        await spirit.commit({
            url: req.body.url
        });
    }
}