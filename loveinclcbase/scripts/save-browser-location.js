export default async function (req, user) {
    if (!req.session.currentUser) return `You must be logged in to save.`;

    let spirit = await req.Spirit.findOne({ service: `${req.body.service}-notherLastSelected`, parent: user._id });
    if (!spirit) spirit = new req.Spirit({ service: `${req.body.service}-notherLastSelected`, parent: user._id });
    await spirit.commit({ selected: parseInt(req.body.selected) });

    return `saved`;
}