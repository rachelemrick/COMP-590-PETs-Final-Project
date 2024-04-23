const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// API endpoint to receive inputs
app.post('/inputs', (req, res) => {
  // Assuming the client sends data in JSON format
  const inputData = req.body;

  // Do something with the input data (e.g., log it)
  console.log('Received input data:', inputData);

  // Send a response (optional)
  res.json({ message: 'Input received successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
