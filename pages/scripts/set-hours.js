const bcrypt = require("bcrypt");

module.exports = async function setHours(db, user, body) {
    try {
        let foundAccount = await db.user.findOne({ username: body.admin });

        if (foundAccount) {
            let passed = await bcrypt.compare(body.adPassword, foundAccount.password);

            if (passed) {
                if (foundAccount.authLevels.includes("ITAD")) {
                    foundAccount = await db.user.findOne({ username: body.org });

                    if (foundAccount) {
                        let foundPage = await db.page.findOne({ name: body.name, user: foundAccount._id });

                        for (let i = 0; i < foundPage.data.tickets.length; i++) {
                            if (foundPage.data.tickets[i].id == body.ticketID) {
                                foundPage.data.tickets[i].used = parseInt(body.used);
                                foundPage.data.tickets[i].quoted = parseInt(body.quoted);

                                foundPage.markModified("data");
                                await foundPage.save();

                                return {
                                    status: "ok",
                                    message: "Ticket Updated"
                                };
                            } 
                        }

                        return {
                            status: "bad",
                            message: "Ticket not found!"
                        };
                    }
                }
                else {
                    return {
                        status: "bad",
                        message: "Access Denied: Unauthorized!"
                    };
                }
            }
            else {
                return {
                    status: "bad",
                    message: "Access Denied: Password incorrect!"
                };
            }
        }
        else {
            return {
                status: "bad",
                message: "Access Denied: Admin not found!"
            };
        }
    } 
    catch(err) {
        console.log(err);
        return {
            status: "bad",
            message: "Error!"
        };
    }
}