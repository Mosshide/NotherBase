import { pingJava } from '@minescope/mineping';

export default async (req, user, io) => {
    const data = await pingJava(req.body.scope == "local" ? "10.0.0.187" : "67.185.48.118");

    return {
        status: "online",
        max: data.players.max,
        online: data.players.online
    };
}