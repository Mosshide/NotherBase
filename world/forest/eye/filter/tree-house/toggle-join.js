export default async function (req, user) {
    let spirit = await req.db.Spirit.recallOne(`cards-against-Bible`);

    if (!spirit.memory.data) {
        spirit.memory.data = {};
    }

    spirit.memory.data = {
        state: "waiting",
        players: [],
        judge: -1,
        ...spirit.memory.data
    };
    
    if (spirit.memory.data.state === "waiting") {
        if (!Array.isArray(spirit.memory.data.players)) spirit.memory.data.players = [];
        // remove null and undefined players
        for (let i = 0; i < spirit.memory.data.players.length; i++) {
            if (spirit.memory.data.players[i] === null || spirit.memory.data.players[i] === undefined) {
                spirit.memory.data.players.splice(i, 1);
                i--;
            }
        }

        if (!spirit.memory.data.players.includes(user.data.username)) {
            if (spirit.memory.data.players.length < 12) spirit.memory.data.players.push(user.data.username);
        }
        else {
            //splice out the player
            spirit.memory.data.players.splice(spirit.memory.data.players.indexOf(user.data.username), 1);
        }
    }

    await spirit.commit();

    return {};
}