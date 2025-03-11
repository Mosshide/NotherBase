export default async (req, user) => {
    if (Date.now() - req.session.mailingListLast < 20000) return "Please wait before signing up for the mailing list again.";

    let spirit = await req.db.Spirit.create("loveinclc-mailing-list", {
        name: req.body.name,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        email: req.body.email,
        notes: "",
        checked: false
    });

    let body = `<h1>New Sign Up for the Mailing List:</h1><br><br>
                <h4>Name: ${req.body.name}</h4>
                <p>Email: ${req.body.email}</p>
                <p>Adress: ${req.body.street ? `${req.body.street}, ${req.body.city}, ${req.body.state} ${req.body.zip}` : "No Address Provided"}</p><br><br>
                <p>This is an automated message. Please do not reply.</p>`;

    //req.db.SendMail.send("wyattsushi@gmail.com", `All Sign Ups for the Mailing List`, body, "Love INC of Lewis County");
    req.db.SendMail.send("exec.director@loveincoflewiscounty.org", `All Sign Ups for the Mailing List`, body, "Love INC of Lewis County");

    // also send a confirmation to the user
    req.db.SendMail.send(req.body.email, `Thank you for signing up for the Love INC of Lewis County Mailing List`, `
        <h1>Thank you for signing up for the Love INC of Lewis County Mailing List!</h1><br>
        <br><br>
        <p>If you have any questions, please contact us at (360) 748-8611.</p>
        <br><br>
        <p>This is an automated message. Please do not reply.</p>
    `, "Love INC of Lewis County");

    req.session.mailingListLast = Date.now();
    return "Thanks! You have been added to the mailing list.";
}