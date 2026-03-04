import fetch from 'node-fetch';

function streamToString (stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
}

export default async (req, user) => {
    const response = await fetch('https://api.github.com/repos/Mosshide/loveinclcbase/contents/world');
    // 60 unauth fetches / hour
    // "https://raw.githubusercontent.com/Mosshide/loveinclcbase/main/public/documents/volunteer-application.pdf"
    //const bodyText = response?.body ? await streamToString(response.body) : null;
    const data = await response.json();

    //console.log(data);
    
    return null;
}