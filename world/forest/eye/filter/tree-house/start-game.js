export default async function (req, user) {
    let spirit = await req.db.Spirit.recallOne(`cards-against-Bible`);
    let prompts = await req.db.Spirit.recallAll(`cards-against-Bible-prompts`);
    let answers = await req.db.Spirit.recallAll(`cards-against-Bible-answers`);

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
        
        if (spirit.memory.data.players.length >= 3 && answers.memory.length >= 7 * spirit.memory.data.players.length) {
            spirit.memory.data.state = "playing";
            // assign random judge
            spirit.memory.data.judge = Math.floor(Math.random() * spirit.memory.data.players.length);
            // pick random prompt card
            if (prompts.memory.length > 0) {
                spirit.memory.data.prompt = prompts.memory[Math.floor(Math.random() * prompts.memory.length)].data.backups[0].data;
            }
            else spirit.memory.data.prompt = "Prompt Card 0";
            // shuffle answer cards
            // draw 7 answer cards for each player
            spirit.memory.data.hand = {};
            spirit.memory.data.chosen = {};
            let drawn = [];
            spirit.memory.data.players.forEach(player => {
                spirit.memory.data.hand[player] = [];
                for (let i = 0; i < 7; i++) {
                    let random = Math.floor(Math.random() * answers.memory.length);
                    while (drawn.includes(random)) {
                        random = Math.floor(Math.random() * answers.memory.length);
                    }

                    spirit.memory.data.hand[player].push(answers.memory[random].data.backups[0].data);
                    drawn.push(random);
                }
            });
        }

        await spirit.commit();
    }

    return {};
}