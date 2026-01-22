export default async (req, user) => {
    // implement cds to avoid spam
    if (typeof req.session.lastMessageSentAt !== "number") req.session.lastMessageSentAt = 0;
    if (Date.now() - req.session.lastMessageSentAt < 60 * 1000) return `Thank you. Please wait a bit and try again.`;
    req.session.lastMessageSentAt = Date.now();

    await req.SendMail.send("wyatt@notherbase.com", `From: ${req.body.from}`, `<p>Message: ${req.body.message.replace(/(?:\r\n|\r|\n)/g, '<br />')}</p>`);
    return `Your message has been sent. Thank you!`;
}