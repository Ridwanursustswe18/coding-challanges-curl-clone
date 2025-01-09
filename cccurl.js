const net = require('net');
const args = process.argv;
method = args[2] === '-X' ? args[3] : 'GET';
let data = '';
let specificHeader = '';
if(method === 'POST'){
    data = args[6]; 
    specificHeader = args[args.length-1];
}
const urlIndex = args[2] === '-X'?4:process.argv.length-1;
function sendRequest(url) {
    const { protocol, hostname, port, pathname } = new URL(url);
    const portNumber = port || (protocol === 'http:' ? 80 : 443);
    const client = new net.Socket();
    let response = '';
    client.connect(portNumber, hostname, () => {
        const requestParts = [
            `${method} ${pathname} HTTP/1.1`,
            `Host: ${hostname}`,
            'Accept: */*'
        ];

        if (method === 'POST' && data) {
            requestParts.push(specificHeader);
            requestParts.push(`Content-Length: ${Buffer.byteLength(data)}`);
        }
        requestParts.push('Connection: close');
        requestParts.push('');
        if (method === 'POST' && data) {
            requestParts.push(data);
        }
        // Add final empty line for http protocol
        requestParts.push('');
        const request = requestParts.join('\r\n');
        client.write(request);
    });

    client.on('data', (data) => {
        response += data.toString();
    });

    client.on('end', () => {
        const [headerPart, bodyPart] = response.split('\r\n\r\n');
        const headers = headerPart.split('\r\n');
        if(args[2] === '-v') {
            console.log(`> GET ${pathname} HTTP/1.1`);
            console.log(`> Host: ${hostname}`);
            console.log("> Accept: */*");
            console.log(">");
            headers.forEach(header => {
                console.log(`< ${header}`);
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
try {
    sendRequest(extractedUrl);
} catch (error) {
    console.error('Error:', error.message);
}

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
// extractURL(url);


