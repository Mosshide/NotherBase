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
                        total++;
                        tasks.memory[i].data = {
                            _backupsEnabled: true,
                            backups: [{ data: tasks.memory[i].data }]
                        };
                    }
                }
            }
            tasks.commit();
            console.log(`Migrated ${tasks.memory.length} -> ${total} tasks.`);
        }
    }
    migrate("user", "username", 9);

    let resetMigration = async function (service) {
        // let tasks = await req.db.Spirit.delete(service, {}, user.id);
        // console.log(tasks + " tasks deleted.");
        let tasks = await req.db.Spirit.recallAny(`${service}`);
        for (let i = 0; i < tasks.memory.length; i++) {
            tasks.memory[i].service = service;
            tasks.memory[i].data = tasks.memory[i].data.backups[0];
            tasks.memory[i].markModified("service");
        }
        tasks.commit();
    }
    //resetMigration("user");
}