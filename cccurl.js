args = process.argv.slice(2);
const extractedUrl = args[0];
function extractURL(extractedUrl){
    const url = new URL(extractedUrl);
    const protocol = url.protocol.replace(':', '');
    const host = url.hostname;
    const port = url.port || 80
    const path = url.pathname || '/';
    console.log(`connecting to ${host}`);
    console.log(`Sending request to GET ${path} HTTP/1.1`);
    console.log(`Host: ${host}`);
    console.log("Accept: */*")
}
console.log(extractURL(extractedUrl));
