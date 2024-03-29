import bcrypt from "bcrypt";

export default async function deleteTicket(req, user) {
    let admin = await req.db.User.recallOne(req.body.admin);

    if (admin) {
        let passed = await bcrypt.compare(req.body.adPassword, admin.memory.data.password);

        if (passed) {
            if (admin.memory.data.authLevels.includes("ITAD")) {
                let page = await req.db.Spirit.recallOne("it", user.id);

                let pageData = page.memory.data;
                
                for (let i = 0; i < pageData.length; i++) {
                    if (pageData[i].id == req.body.ticketID) {
                        pageData.splice(i, 1);

                        await page.commit();

                        return "Ticket Deleted";
                    } 
                }
            }
            else return "Access Denied: Unauthorized!";
        }
        else  return "Access Denied: Password incorrect!";
    }
    else return "Access Denied: Admin not found!";
}