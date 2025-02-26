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

    req.session.mailingListLast = Date.now();
    return "Thanks! You have been added to the mailing list.";
}