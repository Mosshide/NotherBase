import { pingJava } from '@minescope/mineping';

export default async (req, user, io) => {
    console.log(req.body.scope);
    try {
        const data = await pingJava(req.body.scope == "local" ? "10.0.0.60" : "mc.notherbase.com");
        console.log(data);
        

        return {
            status: "online",
            max: data.players.max,
            online: data.players.online
        };
    }
    catch (e) {
        console.log(e);
        return {
            status: "offline"
        };
    }
}