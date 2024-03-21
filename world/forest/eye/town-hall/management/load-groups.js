export default async function (req, user) {
    const getInGroups = async (settings) => {
        settings = {
            getName: true,
            getMembers: false,
            getJoinRequests: false,
            getSettings: false,
            ...settings
        }

        let groups = await req.db.Spirit.recallAll("group");
        let inGroups = [];
        
        for (let i = 0; i < groups.memory.length; i++) {
            if (!groups.memory[i].data) groups.memory.splice(i, 1);
            else {
                if (Array.isArray(groups.memory[i].data.members)) {
                    let userFound = false;
    
                    if (settings.getMembers) {
                        for (let j = 0; j < groups.memory[i].data.members.length; j++) {
                            let findUser = null;
                            if (groups.memory[i].data.members[j].id == `${user.id}`) {
                                userFound = true;
                                groups.memory[i].data.members[j].name = user.memory.data.username;
                            }
                            else {
                                findUser = await req.db.User.recallOne(null, null, groups.memory[i].data.members[j].id);
                                if (findUser) groups.memory[i].data.members[j].name = findUser.memory.data.username;
                            }
                        }
                    }
                    
                    if (userFound) {
                        if (settings.getJoinRequests) {
                            if (!Array.isArray(groups.memory[i].data.joinRequests)) groups.memory[i].data.joinRequests = [];
        
                            for (let j = 0; j < groups.memory[i].data.joinRequests.length; j++) {
                                let findUser = await req.db.User.recallOne(null, null, groups.memory[i].data.joinRequests[j].id);
                                
                                groups.memory[i].data.joinRequests[j].name = findUser.memory.data.username;
                            }
                        }

                        inGroups.push(groups.memory[i]);
                    }
                }
                else groups.memory[i].data.members = [];
            }
        }

        await groups.commit();

        return inGroups;
    }

    let inGroups = await getInGroups({
        getMembers: true,
        getJoinRequests: true,
        getSettings: true
    });

    return inGroups;
}