export default async (req, user) => {
    let towerCrud = async function (service, individual) {
        if (!req.session.currentUser) {
            return `You must be logged in to save a(n) ${individual}.`;
        }
        else if (!user.data.authLevels.includes("Creator")) {
            return `You must be a Creator to save a(n) ${individual}.`;
        }
        else if (!req.body.item?._id) {
            let spirit = new req.Spirit({
                service, 
                data: req.body.item.data, 
                parent: null
            });
            await spirit.save();
            return { newID: spirit._id, message: `created` };
        }
        else if (req.body.deleting) {
            let del = await req.Spirit.deleteOne({ service, parent: null, _id: req.body.item._id });
            return `deleted.`;
        }
        else {
            let spirit = await req.Spirit.findOne({ 
                service, 
                parent: null, 
                _id: req.body.item._id 
            });            
            await spirit.commit(req.body.item.data);
            return `${individual} saved.`;
        }
    }
    
    return await towerCrud("user", "User");
}