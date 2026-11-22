export default async function destroySession(req, user) {
    if (user?.data?.sessions?.[req.body.sessionID]) {
        delete user.data.sessions[req.body.sessionID];
        user.markModified('data.sessions');
        await user.commit();
        return "Destroyed.";
    }
    else return "Session not found.";
}