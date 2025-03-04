export default async (req, user) => {
    if (!req.body.name || !req.body.location || !req.body.payment) {
        return { newID: null, message: "Please fill out all required fields." };
    }
    else if (!req.body.cart || !Array.isArray(req.body.cart) || req.body.cart.length === 0) {
        return { newID: null, message: "Please add items to your cart." };
    }
    else {
        let spirit = await req.db.Spirit.create("shirt-orders", {}, null);
        await spirit.commit({
            name: req.body.name,
            location: req.body.location,
            email: req.body.email,
            payment: req.body.payment,
            notes: req.body.notes,
            cart: req.body.cart,
            messages: [{ date: Date.now(), message: "Order created! Thank you!", from: "Nother Shirts" }],
            paid: false,
            delivered: false,
            notherNotes: ""
        });

        if (req.body.email && typeof req.body.email === "string" && req.body.email.includes("@")) await req.db.SendMail.send(req.body.email, `Thank you for your order!`, `
            <h1>Nother Shirts</h1> <br>
            Order ID: ${spirit.memory._id} <br><br>
            <p>Thank you for ordering from Nother Shirts! Please keep an eye on the page linked below for updates on your order:</p> <br>
            <a href="https://notherbase.com/shirts?o=${spirit.memory._id}">https://notherbase.com/shirts?o=${spirit.memory._id}</a> <br><br>
            <p>Thank you for supporting us!</p>
            <p>This is an automated message. Please do not reply to this email. If you have any questions, please message us using the link above.</p>
        `);

        return { newID: spirit.memory._id, message: `Order created! Thank you!` };
    }
}