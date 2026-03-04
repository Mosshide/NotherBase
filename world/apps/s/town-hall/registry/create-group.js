export default async function (req, user) {
    let spirit = await req.db.Spirit.recallOne("group", null, { name: req.body.name });

    console.log(spirit);
    if (!spirit?.memory?.data.members || spirit?.memory?.data.members.length < 0) {
        await  req.db.Spirit.create("group", { 
            name: req.body.name,
            description: req.body.description,
            members: [{
                id: `${user.memory._id}`,
                auth: [ "Leader" ]
            }],
            joinRequests: [
                /*{
                    id: String,
                    note: String
                }*/
            ],
            settings: {
                memberLimit: -1
            }
        });

        return true;
    }
    else return false;
}