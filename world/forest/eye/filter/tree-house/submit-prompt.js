export default async (req, user) => {
    let spirit = await req.db.Spirit.create(`cards-against-Bible-prompts`, {});
    
    spirit.addBackup({
        text: req.body.text,
        category: "No Category"
    });
    await spirit.commit();
}