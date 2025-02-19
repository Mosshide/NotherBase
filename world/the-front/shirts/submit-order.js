export default async (req, user) => {
    let spirit = await req.db.Spirit.create("shirt-orders", {}, null);
    await spirit.commit({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        paymentMethod: req.body.paymentMethod,
        notes: req.body.notes,
        cart: req.body.cart
    });
    return { newID: spirit.memory._id, message: `created` };
}