const net = require('net');
const urlIndex = process.argv.length - 1;
const args = process.argv;
function sendGetRequest(url) {
    const { protocol, hostname, port, pathname } = new URL(url);
    const portNumber = port || (protocol === 'http:' ? 80 : 443);
    const client = new net.Socket();
    let response = '';
    client.connect(portNumber, hostname, () => {
        if(args[2] === '-v'){
            //console.log(`Sending request GET ${pathname} HTTP/1.1`);
            console.log(`> GET ${pathname} HTTP/1.1`)
            console.log(`> Host: ${hostname}`);
            console.log("> Accept: */*");
            console.log(">");
            //console.log("Connection: close");
        }
        client.write(`GET ${pathname} HTTP/1.1\r\n`);
        client.write(`Host: ${hostname}\r\n`);
        client.write('Connection: close\r\n');
        client.write('\r\n');
    });

    client.on('data', (data) => {
        response += data.toString();
    });

    client.on('end', () => {
        const [headerPart,bodyPart] = response.split('\r\n\r\n');
        const headers = headerPart.split('\r\n');
        modifiedHeaders = headers.map(header => `< ${header}`);
        if(args[2] == "-v"){
            modifiedHeaders.forEach(header => {
            console.log(header);
        });
            console.log('<');   
        }
        console.log(bodyPart);   
    });

    client.on('error', (err) => {
        console.error(`Connection error: ${err.message}`);
    });

}
const extractedUrl = args[urlIndex];
sendGetRequest(extractedUrl);

// function extractURL(url){
//     const protocol = url.protocol.replace(':', '');
//     const host = url.hostname;
//     const port = url.port || 8080
//     const path = url.pathname || '/';
//     console.log(`connecting to ${host}`);
//     console.log(`Sending request  GET ${path} HTTP/1.1`);
//     console.log(`Host: ${host}`);
//     console.log("Accept: */*")
// }
// // extractURL(url);


