export default async (req, user) => {
    let migrate = async function (service, verifier, offset) {
        let isDone = await req.db.Spirit.recallOne("migration-check");
        if (!isDone.memory.data[service + offset.toString()]) {
            isDone.memory.data[service + offset.toString()] = true;
            await isDone.commit();

            let total = 0;
            let tasks = await req.db.Spirit.recallAny(service);
            for (let i = 0; i < tasks.memory.length; i++) {
                if (tasks.memory[i].data) {
                    if (!tasks.memory[i].data._backupsEnabled) {
                        total += tasks.memory[i].data.length;
                        for (let j = 0; j < tasks.memory[i].data.length; j++) {
                            while (j < tasks.memory[i].data.length && !tasks.memory[i].data[j][verifier]) {
                                tasks.memory[i].data.splice(j, 1);
                                j++;
                            }
                            let newTask = await req.db.Spirit.create(service, {}, tasks.memory[i].parent);
                            newTask.addBackup(tasks.memory[i].data[j]);
                            await newTask.commit();
                        }
                        tasks.memory[i].service = `old-${service}`;
                        tasks.memory[i].markModified("service");
                    }
                }
            }
            tasks.commit();
            console.log(`Migrated ${tasks.memory.length} -> ${total} tasks.`);
        }
    }
    migrate("small-group", "name", 1);

    let basicCrud = async function (service, individual) {
        if (!user.loggedIn()) {
            return `You must be logged in to save a(n) ${individual}.`;
        }
        else if (!req.body.item?.id) {
            let spirit = await req.db.Spirit.create(service, {}, user.id);
            spirit.addBackup(req.body.item.data);
            await spirit.commit();
            return `${individual} created.`;
        }
        else if (req.body.deleting) {
            let del = await req.db.Spirit.delete(service, {}, user.id, req.body.item.id);
            return `${del} deleted.`;
        }
        else {
            let spirit = await req.db.Spirit.recallOne(service, user.id, {}, req.body.item.id);
            spirit.addBackup(req.body.item.data);
            await spirit.commit();
            return `${individual} saved.`;
        }
    }
    return await basicCrud("small-group", "Group");
}