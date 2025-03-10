export default async function submitApplication(req, user) {
    let spirits = await req.db.Spirit.recallAll("rc-training-0325");

    let total = 0;
    let body = `<h1>All Registrations for Redemptive Compassion Training Session 2025</h1>
        <h3>People Registered:</h3>`;

    for (let ticket of spirits) {
        body += `<p>${ticket.memory.data.name}${ticket.memory.data.extras ? ` + ${ticket.memory.data.extras} Extra` : ""}</p>`;
        total += ticket.memory.data.extras ? parseInt(ticket.memory.data.extras) + 1 : 1;
    }
    
    body += `<br><h3>Total Attending:</h3>
            <p>${total} Persons</p>`;
    body += ` <br><p>This is an automated message. Please do not reply.</p>`;

    //req.db.SendMail.send("wyattsushi@gmail.com", `All Registrations for Redemptive Compassion Training Session 2025`, body, "Love INC of Lewis County");
    req.db.SendMail.send("exec.director@loveincoflewiscounty.org", `All Registrations for Redemptive Compassion Training Session 2025`, body, "Love INC of Lewis County");

    return "Thank you for registering!";
}