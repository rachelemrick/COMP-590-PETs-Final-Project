// Dependencies
var http = require('http');
// var JIFFServer = require('../../lib/jiff-server.js');
const { JIFFServer } = require('jiff-mpc');
var mpc = require('../mpc.js');
const path = require('path');
const bodyParser = require('body-parser');

const { startAnalyst } = require('./analyst.js');
const { clientlogic } = require('./clientlogic.js');

// Create express and http servers
var express = require('express');
var app = express();
http = http.Server(app);

// Create JIFF server
var jiff_instance = new JIFFServer(http, {
  logs: false,
  socketOptions: {
    pingTimeout: 1000,
    pingInterval: 2000
  }
});
jiff_instance.computationMaps.maxCount['web-mpc'] = 100000; // upper bound on how input parties can submit!

// Specify the computation server code for this demo
var computationClient = jiff_instance.compute('web-mpc', {
  crypto_provider: true
});
computationClient.wait_for([1], function () {
  // Perform server-side computation.
  console.log('Computation initialized!');

  // When the analyst sends the begin signal, we start!
  computationClient.listen('begin', function () {
    console.log('Analyst sent begin signal!');

    // Get all connected parties IDs
    var party_count = 0;
    var party_map = jiff_instance.socketMaps.socketId['web-mpc'];
    for (var id in party_map) {
      if (party_map.hasOwnProperty(id)) {
        party_count++;
      }
    }

    // Send number of parties to analyst
    computationClient.emit('number', [ 1 ], party_count.toString());

    // execute the mpc protocol
    mpc(computationClient, party_count);

    // clean shutdown
    setTimeout(function () {
      console.log('Shutting Down!');
      http.close();
    }, 1000);
  });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Endpoint to handle the AJAX request
app.post('/start-analyst', (req, res) => {
  startAnalyst(); // Call your Node.js function
  res.send('Node function called successfully');
});

app.post('/share-input', (req, res) => {
  const data = req.body;
  const input = parseInt(data['input']);
  clientlogic(input); // Call your Node.js function
  res.send('Node function called successfully');
});

http.listen(8080, function () {
  console.log('listening on *:8080');
});

console.log('web-mpc demo..');
console.log('The steps for running are as follows:');
console.log('1. Run the analyst (node analyst.js)');
console.log('2. After the analyst sets up the computation, you can choose to terminate it or leave it around');
console.log('3. Run "node input-party.js <input number>" to create a new input party and submit its input');
console.log('4. When desired, press enter in the analyst terminal (after re-running it if previously closed) to compute the output and close the session');
