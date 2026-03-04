export default async function (req, user) {
    let spirit = await req.db.Spirit.recallOne(`cards-against-Bible`);

    if (!spirit.memory.data) {
        spirit.memory.data = {};
    }

    spirit.memory.data = {
        state: "waiting",
        players: [],
        judge: -1,
        score: {},
        ...spirit.memory.data,
        expiration: Date.now() + 1000 * 30
    };
    
    if (spirit.memory.data.state === "playing") {
        spirit.memory.data.chosen[user.data.username] = req.body.card;

        let allChosen = true;
        for (let player of spirit.memory.data.players) {
            if (typeof spirit.memory.data.chosen[player] != "number" && player !== spirit.memory.data.players[spirit.memory.data.judge]) {
                allChosen = false;
                break;
            }
        }

        if (allChosen) {
            spirit.memory.data.state = "judging";
        }

        await spirit.commit();
    }

    return {};
}