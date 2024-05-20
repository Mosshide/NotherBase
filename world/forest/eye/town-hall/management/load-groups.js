export default async function (req, user) {
    const getInGroups = async (settings) => {
        settings = {
            getName: true,
            getMembers: false,
            getJoinRequests: false,
            getSettings: false,
            ...settings
        }

        let groups = await req.db.Spirit.recallAll("group", null, {
            members: {
                $elemMatch: {
                    id: `${user.id}`
                }
            }
        });

        let foundUsers = {};
        let inGroups = [];

        for (let i = 0; i < groups.memory.length; i++) {
            // get members' usernames
            for (let j = 0; j < groups.memory[i].data.members.length; j++) {
                if (groups.memory[i].data.members[j].id == `${user.id}`) {
                    groups.memory[i].data.members[j].name = user.username;
                }
                else {
                    if (!foundUsers[groups.memory[i].data.members[j].id]) {
                        foundUsers[groups.memory[i].data.members[j].id] = await req.db.User.recallOne(null, null, groups.memory[i].data.members[j].id);
                    }
                    if (foundUsers[groups.memory[i].data.members[j].id]) groups.memory[i].data.members[j].name = foundUsers[groups.memory[i].data.members[j].id].username;
                }
            }

            // get join requests' usernames
            for (let j = 0; j < groups.memory[i].data.joinRequests.length; j++) {
                if (!foundUsers[groups.memory[i].data.joinRequests[j].id]) {
                    foundUsers[groups.memory[i].data.joinRequests[j].id] = await req.db.User.recallOne(null, null, groups.memory[i].data.joinRequests[j].id);
                }
                if (foundUsers[groups.memory[i].data.joinRequests[j].id]) groups.memory[i].data.joinRequests[j].name = foundUsers[groups.memory[i].data.joinRequests[j].id].username;
            }

            inGroups.push(groups.memory[i]);
        }

        return inGroups;
    }

    let inGroups = await getInGroups({
        getMembers: true,
        getJoinRequests: true,
        getSettings: true
    });

    return inGroups;
}