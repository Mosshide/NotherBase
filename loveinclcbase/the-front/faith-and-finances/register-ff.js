export default async function submitApplication(req, user) {
    // require a cooldown between applications of 1 minute
    if (!req.session.lastRCTrainingApplication) req.session.lastRCTrainingApplication = 0;
    if (Date.now() - req.session.lastRCTrainingApplication < 60 * 1000) return "Please wait before trying to register for this event again.";
    else {
        let newTicket = {
            dateCreated: Date.now(),
            name: req.body.name,
            extras: req.body.extras || 0,
        }

        await req.db.Spirit.create("rc-training-0325", newTicket);
        req.session.lastRCTrainingApplication = Date.now();

        //req.db.SendMail.send("wyattsushi@gmail.com", `New Registration for Redemptive Compassion Training Session 2025`, `
        req.db.SendMail.send("exec.director@loveincoflewiscounty.org", `New Registration for Redemptive Compassion Training Session 2025`, `
            <h1>New Registration for Redemptive Compassion Training Session 2025</h1>
            <h3>Person Registered:</h3>
            <p>${newTicket.name}</p> <br>
            <h3>Extra Attendees:</h3>
            <p>${newTicket.extras}</p> <br><br>
            <p>This is an automated message. Please do not reply.</p>
        `, "Love INC of Lewis County");

        return "Thank you for registering!";
    }
}