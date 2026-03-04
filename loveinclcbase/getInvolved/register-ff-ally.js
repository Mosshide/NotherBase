export default async function submitApplication(req, user) {
    // require a cooldown between applications of 1 minute
    // if (!req.session.lastFFRegistration) req.session.lastFFRegistration = 0;
    //if (Date.now() - req.session.lastFFRegistration < 1000) return "You've already registered. Please wait before trying to register for this course again.";
    if (Date.now() - req.session.lastFFRegistration < 60 * 1000) return "You've already registered. Please wait before trying to register for this course again.";
    else {
        let newRegistration = {
            dateCreated: Date.now(),
            registration: {
                name: req.body.registration.name,
                signature: req.body.registration.signature,
                address: req.body.registration.address,
                city: req.body.registration.city,
                state: req.body.registration.state,
                phone: req.body.registration.phone
            }
        }

        req.db.Spirit.create("faith-and-finances-ally-09-25", newRegistration);

        //req.db.SendMail.send("wyattsushi@gmail.com", `New Registration for Ally (Mentor) for Faith and Finance Course September 2025`, `
        req.db.SendMail.send("exec.director@loveincoflewiscounty.org", `New Registration for Ally (Mentor) for Faith and Finance Course September 2025`, `
            <h1>New Registration for Ally (Mentor) for Faith and Finance Course September 2025</h1>
            <h3>Registration Information:</h3>
            <p>Name: ${newRegistration.registration.name}</p>
            <p>Signature: ${newRegistration.registration.signature}</p>
            <p>Address: ${newRegistration.registration.address || "N/A"}</p>
            <p>City: ${newRegistration.registration.city || "N/A"}</p>
            <p>State: ${newRegistration.registration.state || "N/A"}</p>
            <p>Phone: ${newRegistration.registration.phone || "N/A"}</p>
            <br>
            <br><br>
            <p>This is an automated message. Please do not reply.</p>
        `, "Love INC of Lewis County");

        req.session.lastFFRegistration = Date.now();

        return "Thank you for registering as an Ally (Mentor) for the Faith and Finance course! We will see you Saturday!";
    }
}