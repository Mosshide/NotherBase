export default async (req, user) => {
    let spirits = await req.Spirit.find({ service: "loveinclc-mailing-list" });
    let amountChecked = 0;
    // set checked to false for all mailing list items
    spirits.forEach(spirit => {
        if (spirit.data.checked) {
            spirit.data.checked = false;
            amountChecked++;
        }
        spirit.commit();
    });
    
    return `${amountChecked} mailing list items unchecked.`;
}