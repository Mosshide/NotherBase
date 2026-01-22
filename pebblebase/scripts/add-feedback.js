export default async (req, user) => {
    let spirit = new req.Spirit({ 
        service: "the-pebble-feedback", 
        data:{
            content: req.body.feedback,
            notes: "",
            checked: false
        }
    });
    await spirit.commit();
}