const net = require('net');
args = process.argv.slice(2);

function sendGetRequest(url) {
    const { protocol, hostname, port, pathname } = new URL(url);
    const portNumber = port || (protocol === 'http:' ? 80 : 443);
    const client = new net.Socket();
    client.connect(portNumber, hostname, () => {
        console.log(`Sending request GET ${pathname} HTTP/1.1`);
        console.log(`Host: ${hostname}`);
        console.log("Accept: */*");
        console.log("Connection: close");
        client.write(`GET ${pathname} HTTP/1.1\r\n`);
        client.write(`Host: ${hostname}\r\n`);
        client.write('Connection: close\r\n');
        client.write('\r\n');
    });

    client.on('data', (data) => {
        console.log(data.toString());
        client.end();
    });

    client.on('close', () => {
       
    });

    client.on('error', (err) => {
        console.error(`Connection error: ${err.message}`);
    });

}
const extractedUrl = args[0];
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


