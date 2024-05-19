export default async function (req, user) {
    let spirit = await req.db.Spirit.recallOne(`cards-against-Bible`);

    if (spirit.memory.data) return spirit.memory.data;
    else return {
        state: "waiting",
        players: [],
        judge: -1,
        score: {}
    };
}