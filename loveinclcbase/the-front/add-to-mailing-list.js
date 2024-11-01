export default async (req, user) => {
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
}