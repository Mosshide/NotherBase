export default async (req, user) => {
    let spirit = await req.db.Spirit.create("shirt-orders", {}, null);
    await spirit.commit({
        name: req.body.name,
        location: req.body.location,
        email: req.body.email,
        payment: req.body.payment,
        notes: req.body.notes,
        cart: req.body.cart,
        updates: req.body.updates,
        status: "pending"
    });
    return { newID: spirit.memory._id, message: `created` };
}