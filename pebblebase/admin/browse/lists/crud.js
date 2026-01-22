export default async function (req, user, service) {
    if (!req.session.currentUser) {
        return `You must be logged in to save a(n) ${service} item.`;
    }
    else if (!req.body.item?._id || req.body.item._id === "new") {
        let spirit = new req.Spirit({
            service, 
            data: req.body.item.data, 
            parent: user._id
        });
        await spirit.commit();
        return { newID: spirit._id, message: `created` };
    }
    else if (req.body.deleting) {
        let del = await req.Spirit.deleteOne({ service, parent: user._id, _id: req.body.item._id });
        return `${del} deleted.`;
    }
    else {      
        let spirit = await req.Spirit.findOne({ service, parent: user._id, _id: req.body.item._id });
        await spirit.commit(req.body.item.data);
        return `saved`;
    }
}