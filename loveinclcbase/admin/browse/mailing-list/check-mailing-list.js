export default async (req, user) => {
    let spirits = await req.db.Spirit.recallAll("loveinclc-mailing-list");
    let amountChecked = 0;
    // set checked to false for all mailing list items
    spirits.forEach(spirit => {
        if (!spirit.memory.data.checked) {
            spirit.memory.data.checked = true;
            amountChecked++;
        }
        spirit.addBackup(spirit.memory.data);
        spirit.commit();
    });
    
    return `${amountChecked} mailing list items checked.`;
}