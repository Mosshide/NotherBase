export default async (req, user) => {
    if (user.memory.data.authLevels.includes("Creator")) {
        let spirit = await req.db.User.recallOne(req.body.data.email);
        
        if (spirit) {
            spirit.memory.data.authLevels = req.body.data.authLevels;
            await spirit.commit();

            return spirit.memory.data;
        }

        return null;
    }
}