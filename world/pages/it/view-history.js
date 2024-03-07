export default async function viewHistory(req, user) {
    let page = await req.db.Spirit.recallAll("it", user.id);

    let sendTickets = [];
    let afterDate = new Date(req.body.dateStart + "T00:00");
    let beforeDate = new Date(req.body.dateEnd + "T00:00");

    for (let i = 0; i < page.memory.length; i++) {
        if (page.memory[i].data.backups) {
            if (!page.memory[i].data.backups[0].data.id) page.memory[i].data.backups[0].data.id = Date.now();
            if (!page.memory[i].data.backups[0].data.comments) page.memory[i].data.backups[0].data.comments = [];
    
            if (page.memory[i].data.backups[0].data.date >= afterDate && page.memory[i].data.backups[0].data.date <= beforeDate) {
                sendTickets.push(page.memory[i]);
            }
        }
        else console.log("No backups found.", page.memory[i].data);
    }
    console.log(sendTickets);

    return sendTickets;
}