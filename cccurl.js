const net = require('net');
const urlIndex = process.argv.length - 1;
const args = process.argv;

function sendRequest(url) {
    const { protocol, hostname, port, pathname } = new URL(url);
    const portNumber = port || (protocol === 'http:' ? 80 : 443);
    const client = new net.Socket();
    let response = '';
    
    client.connect(portNumber, hostname, () => {
        const method = args[2] === '-X' ? args[3] : 'GET';
        const request = [
            `${method} ${pathname} HTTP/1.1`,
            `Host: ${hostname}`,
            'Accept: */*',
            'Connection: close',
            '',
            '' 
        ].join('\r\n');
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
// // extractURL(url);


