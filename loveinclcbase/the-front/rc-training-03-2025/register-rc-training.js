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

        return "Thank you for registering!";
    }
}