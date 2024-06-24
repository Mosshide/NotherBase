export default async function viewHistory(req, user) {
    let page = await req.db.Spirit.recallAll("it", user.memory._id);
    
    console.log(new Date(Date.now()));
    console.log(new Date(req.body.dateStart + "T00:00"), new Date(req.body.dateEnd + "T00:00"));
    let sendTickets = [];
    let afterDate = new Date(req.body.dateStart + "T00:00");
    let beforeDate = new Date(req.body.dateEnd + "T00:00");
    
    console.log(page[0].memory.data);
    for (let i = 0; i < page.length; i++) {
        if (page[i].memory) {
            if (!page[i].memory.data.id) page[i].memory.data.id = Date.now();
            if (!page[i].memory.data.comments) page[i].memory.data.comments = [];
            
            console.log(new Date(page[i].memory.data.date));
            if (page[i].memory.data.date >= afterDate && page[i].memory.data.date <= beforeDate) {
                sendTickets.push(page[i].memory);
            }
        }
    }
    
    return sendTickets;
}