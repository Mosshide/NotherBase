export default async (req, user) => {
    let spirit = new req.Spirit({ 
        service: "the-pebble-waitlist", 
        data:{
            name: req.body.email,
            notes: "",
            checked: false
        }
    });
    await spirit.commit();
}