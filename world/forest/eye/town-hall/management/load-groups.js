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
                    id: `${user.memory._id}`
                }
            }
        });

        let foundUsers = {};
        let inGroups = [];

        for (let i = 0; i < groups.length; i++) {
            // get members' usernames
            for (let j = 0; j < groups[i].memory.data.members.length; j++) {
                if (groups[i].memory.data.members[j].id == `${user.memory._id}`) {
                    groups[i].memory.data.members[j].name = user.memory.data.username;
                }
                else {
                    if (!foundUsers[groups[i].memory.data.members[j].id]) {
                        foundUsers[groups[i].memory.data.members[j].id] = await req.db.Spirit.recallOne("user", null, {}, groups[i].memory.data.members[j].id);
                    }
                    if (foundUsers[groups[i].memory.data.members[j].id]) groups[i].memory.data.members[j].name = foundUsers[groups[i].memory.data.members[j].id].memory.data.username;
                }
            }

            // get join requests' usernames
            for (let j = 0; j < groups[i].memory.data.joinRequests.length; j++) {
                if (groups[i].memory.data.joinRequests[j].id) {
                    if (!foundUsers[groups[i].memory.data.joinRequests[j].id]) {
                        foundUsers[groups[i].memory.data.joinRequests[j].id] = await req.db.Spirit.recallOne("user", null, {}, groups[i].memory.data.joinRequests[j].id);
                    }
                    if (foundUsers[groups[i].memory.data.joinRequests[j].id]) groups[i].memory.data.joinRequests[j].name = foundUsers[groups[i].memory.data.joinRequests[j].id].memory.data.username;
                }
                else {
                    groups[i].memory.data.joinRequests.splice(j, 1);
                    j--;
                    await groups[i].commit();
                }
            }

            inGroups.push(groups[i]);
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