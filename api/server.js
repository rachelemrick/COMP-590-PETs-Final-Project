// Dependencies
var http = require('http');
const bodyParser = require('body-parser');
const { JIFFServer } = require('jiff-mpc');
const routes = require('./routes.js');
const express = require('express');
const mpc = require('../mpc.js')
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

// Mount API routes
app.use(bodyParser.json());

app.post('/inputs', (req, res) => {
  // Assuming the client sends data in JSON format
  const inputData = req.body;

  // Do something with the input data (e.g., log it)
  console.log('Received input data:', inputData);

  // Send a response (optional)
  res.json({ message: 'Input received successfully' });
});

http.listen(8080, function () {
  console.log('listening on *:8080');
});
