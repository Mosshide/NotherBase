export default async function (req, user) {
    let spirit = await req.db.Spirit.recallOne(`cards-against-Bible`);

    if (!spirit.memory.data) {
        spirit.memory.data = {};
    }

    await spirit.commit({
        ...spirit.memory.data,
        state: "waiting",
        players: [],
        judge: -1,
        score: {}
    });

    return {};
}