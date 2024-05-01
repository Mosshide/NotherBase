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
        spirit.memory.data.state = "waiting";
        spirit.memory.data.judge = -1;

        await spirit.commit();
    }

    return {};
}