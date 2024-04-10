const { JIFFServer } = require('jiff-mpc');

const options = {
  // Customize the maximum headers count allowed in a request
  maxHeadersCount: 10,

  // Customize the timeout for socket connections
  timeout: 60000
};

const http = require('http');
const port = process.env.PORT || 3000; // Define the port to listen on

// Create an HTTP server
const server = http.createServer();

// Create the JIFF server instance passing the HTTP server and options
const jiffServer = new JIFFServer(server, options);

// Start listening for connections
server.listen(port, () => {
  console.log(`JIFF server running at http://localhost:${port}/`);
});

server.on('request', (req, res) => {
  if (req.method === 'POST' && req.url === '/hello') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log('Received "hello" message from client:', body);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello from the server!');
    });
  }
});
