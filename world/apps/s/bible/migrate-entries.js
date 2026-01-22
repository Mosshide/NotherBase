export default async (req, user) => {
    let entries = await req.Spirit.find({ service: "bible-notes" });
    for (let entry of entries) {
        if (entry.data) entry.service = "projects";
        await entry.commit();
    }
}