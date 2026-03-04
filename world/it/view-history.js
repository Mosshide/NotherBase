export default async function viewHistory(req, user) {
    let page = await req.Spirit.find({ service: "it", parent: user._id });

    let sendTickets = [];
    let afterDate = new Date(req.body.dateStart + "T00:00");
    let beforeDate = new Date(req.body.dateEnd + "T23:59");
    
    for (let i = 0; i < page.length; i++) {
        if (page[i]?.data) {
            if (!page[i].data.id) page[i].data.id = Date.now();
            if (!page[i].data.comments) page[i].data.comments = [];
            
            if (page[i].data.date >= afterDate && page[i].data.date <= beforeDate) {
                sendTickets.push(page[i]);
            }
        }
    }
    
    return sendTickets;
}