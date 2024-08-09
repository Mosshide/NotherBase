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
        ...spirit.memory.data
    };
    
    if (spirit.memory.data.state === "judging") {
        spirit.memory.data.winner = req.body.winner;
        spirit.memory.data.score[req.body.winner] = (spirit.memory.data.score[req.body.winner] || 0) + 1;
        spirit.memory.data.state = "waiting";
        spirit.memory.data.judge = -1;

        await spirit.commit();
    }

    return {};
}