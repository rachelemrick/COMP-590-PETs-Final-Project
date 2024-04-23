const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// API endpoint to receive inputs
app.post('/inputs', (req, res) => {
  // Assuming the client sends data in JSON format
  const inputData = req.body;

  // Do something with the input data (e.g., log it)
  console.log('Received input data:', inputData);

  // Send a response (optional)
  res.json({ message: 'Input received successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});