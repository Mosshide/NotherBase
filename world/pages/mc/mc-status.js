import { pingJava } from '@minescope/mineping';

export default async (req, user, io) => {
    try {
        const data = await pingJava(req.body.scope == "local" ? "10.0.0.187" : "mc.notherbase.com");

        return {
            status: "online",
            max: data.players.max,
            online: data.players.online
        };
    }
    catch (e) {
        return {
            status: "offline"
        };
    }
}