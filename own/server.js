// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { shareInput } = require('./client.js');
const { compute } = require('./mpc.js');

// Create an Express application
const app = express();

// store shares
var shares = []

// Set up middleware for parsing JSON bodies
app.use(bodyParser.json());

// Define a route handler for GET requests to the root path
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Define a route handler for POST requests to '/api/data'
app.post('/share', (req, res) => {
  const data = req.body;
  const input = data['input'];
  // Do something with the received data
  const share = shareInput(input);
  shares.push(share[0]);
  shares.push(share[1]);

  console.log('Received data:', share);
  res.json({ message: 'Data received successfully' });
});

app.get('/compute', (req, res) => {
  const mean = compute(shares);
  console.log("result is: ", res);
});

// Define a route handler for all other requests
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Set the port to listen on
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
