export default async function submitApplication(req, user) {
    let spirits = await req.Spirit.recallAll("loveinclc-mailing-list");

    let body = `<h1>All Sign Ups for the Mailing List:</h1><br><br>`;

    for (let entry of spirits) {
        body += `<h4>Name: ${entry.data.name}</h4>
        <p>Email: ${entry.data.email}</p>
        <p>Adress: ${entry.data.street ? `${entry.data.street}, ${entry.data.city}, ${entry.data.state} ${entry.data.zip}` : "No Address Provided"}</p><br>`;
    }
    
    body += `<br><p>This is an automated message. Please do not reply.</p>`;

    //req.SendMail.send("wyattsushi@gmail.com", `All Sign Ups for the Mailing List`, body, "Love INC of Lewis County");
    req.SendMail.send("exec.director@loveincoflewiscounty.org", `All Sign Ups for the Mailing List`, body, "Love INC of Lewis County");

    return "Thank you for registering!";
}