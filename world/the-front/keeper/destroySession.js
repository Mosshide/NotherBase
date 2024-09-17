export default async function destroySession(req, user) {
    if (user?.memory?.data?.sessions?.[req.body.sessionID]) {
        delete user.memory.data.sessions[req.body.sessionID];
        user.memory.markModified('data.sessions');
        await user.commit();
        return "Destroyed.";
    }
    else return "Session not found.";
}