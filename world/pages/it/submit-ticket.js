export default async function submitTicket(req, user) {
    let newTicket = {
        date: Date.now(),
        used: 0,
        quoted: 0,
        resolved: false,
        comments: [],
        attachments: [],
        id: Date.now(),
        ...req.body.ticket
    }

    let page = await req.db.Spirit.create("it", {}, user.id);

    page.addBackup(newTicket);   
    await page.commit(); 

    await req.db.SendMail.send(user.memory.data.email, `New IT Request Submitted Successfully`, `
        <h1>Request: ${newTicket.title}</h1> <br>
        Ticket ID: ${newTicket.id} <br>
        Submitted On: ${new Date(newTicket.date).toLocaleDateString()} <br>
        Description: ${newTicket.description}
    `);

    await req.db.SendMail.send("wyatt@notherbase.com", `New IT Request from ${user.memory.data.username}`, `
        <h1>Request: ${newTicket.title}</h1> <br>
        Ticket ID: ${newTicket.id} <br>
        Submitted On: ${new Date(newTicket.date).toLocaleString()} <br>
        From: ${user.memory.data.username} <br>
        Description: ${newTicket.description}
    `);

    return "Request submitted.";
}