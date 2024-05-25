export default async function(req, user) {
    if (req.session.currentUser) {
        let spirit = await req.db.Spirit.recallOne("group", null, null, req.body.groupID);
    
        let leader = null;
        let joiner = null;
        
        for (let i = 0; i < spirit.memory.data.members.length; i++) {
            if (spirit.memory.data.members[i].id == user.memory._id) leader = spirit.memory.data.members[i];
            if (spirit.memory.data.members[i].id == req.body.userID) joiner = spirit.memory.data.members[i];
        }
    
        if (leader.auth.includes("Leader")) {
            if (!req.body.reject) {
                if (joiner?.id == req.body.userID) return "redundant";
                else {
                    for (let i = 0; i < spirit.memory.data.joinRequests.length; i++) {
                        if (spirit.memory.data.joinRequests[i].id == req.body.userID) {
                            spirit.memory.data.members.push({
                                id: `${spirit.memory.data.joinRequests[i].id}`,
                                auth: []
                            });
                            spirit.memory.data.joinRequests.splice(i, 1);
                            await spirit.commit();
        
                            return "accepted";
                        }
                    }
        
                    return "not-found-error";
                }
            }
            else {
                for (let i = 0; i < spirit.memory.data.joinRequests.length; i++) {
                    console.log(spirit.memory.data.joinRequests[i].id, req.body.userID);
                    if (spirit.memory.data.joinRequests[i].id == req.body.userID) {
                        spirit.memory.data.joinRequests.splice(i, 1);
                        await spirit.commit();
    
                        return "rejected";
                    }
                }

                return "not-found-error";
            }
        }
        else return "auth-error";
    }
    else return "login-error";
}