export default async function submitTicket(req, user) {
    if (!req.session.currentUser) return `You must be logged in to submit a ticket.`;
    
    //  implement cooldown of 60 seconds
    if (typeof req.session.lastTicketSubmitted !== "number") req.session.lastTicketSubmitted = 0;
    if (Date.now() - req.session.lastTicketSubmitted < 60000) {
        return `You must wait at least 60 seconds between submitting tickets. Please try again later.`;
    }
    req.session.lastTicketSubmitted = Date.now();

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

    let page = new req.Spirit({ service: "it", data: newTicket, parent: user._id });  
    await page.commit(); 

    if (user.data.email) await req.SendMail.send(user.data.email, `New IT Request Submitted Successfully`, `
        <h1>Request: ${newTicket.title}</h1> <br>
        Ticket ID: ${newTicket.id} <br>
        Submitted On: ${new Date(newTicket.date).toLocaleDateString()} <br>
        Description: ${newTicket.description}
    `);

    await req.SendMail.send("wyatt@notherbase.com", `New IT Request from ${user.data.username}`, `
        <h1>Request: ${newTicket.title}</h1> <br>
        Ticket ID: ${newTicket.id} <br>
        Submitted On: ${new Date(newTicket.date).toLocaleString()} <br>
        From: ${user.data.username} <br>
        Description: ${newTicket.description}
    `);

    return "Request submitted.";
}