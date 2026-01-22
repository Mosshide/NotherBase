export default async function (req, user, service) {
    if (!req.body.item?._id) {
        let spirit = new req.Spirit({
            service, 
            data: req.body.item.data, 
            parent: null
        });
        await spirit.save();
        return { newID: spirit._id, message: `created` };
    }
    else if (req.body.deleting) {
        let del = await req.Spirit.deleteOne({ service, parent: null, _id: req.body.item._id});
        return `deleted.`;
    }
    else {
        let spirit = await req.Spirit.findOne({ 
            service, 
            parent: null, 
            _id: req.body.item._id 
        });
        await spirit.commit(req.body.item.data);
        return `saved`;
    }
}