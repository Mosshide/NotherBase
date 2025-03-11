export default async function submitApplication(req, user) {
    let spirits = await req.db.Spirit.recallAll("loveinclc-mailing-list");

    let body = `<h1>All Sign Ups for the Mailing List:</h1><br><br>`;

    for (let entry of spirits) {
        body += `<h4>Name: ${entry.memory.data.name}</h4>
        <p>Email: ${entry.memory.data.email}</p>
        <p>Adress: ${entry.memory.data.street ? `${entry.memory.data.street}, ${entry.memory.data.city}, ${entry.memory.data.state} ${entry.memory.data.zip}` : "No Address Provided"}</p><br>`;
    }
    
    body += `<br><p>This is an automated message. Please do not reply.</p>`;

    //req.db.SendMail.send("wyattsushi@gmail.com", `All Sign Ups for the Mailing List`, body, "Love INC of Lewis County");
    req.db.SendMail.send("exec.director@loveincoflewiscounty.org", `All Sign Ups for the Mailing List`, body, "Love INC of Lewis County");

    return "Thank you for registering!";
}