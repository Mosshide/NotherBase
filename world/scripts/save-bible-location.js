export default async function (req, user) {
    if (!req.session.currentUser) return `You must be logged in to save.`;

    let spirit = await req.Spirit.findOne({ service: `last-notherBible-location-${req.body.bookmark}`, parent: user._id });
    if (!spirit) spirit = new req.Spirit({ service: `last-notherBible-location-${req.body.bookmark}`, parent: user._id });
    await spirit.commit(req.body.location);

    return `saved`;
}