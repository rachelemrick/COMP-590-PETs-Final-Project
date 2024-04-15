const { JIFFClient } = require('jiff-mpc');

// Define the server address
const serverAddress = 'http://localhost:3000'; // Replace with your server address

// Define the computation ID
const computationID = 'example_computation'; // Replace with your computation ID

// Define options for the JIFF client
const options = {
  party_id: 1, // Replace with your party ID
  party_count: 2,// Add any other options as needed
};

// Create a JIFF client instance
const jiffClient = new JIFFClient(serverAddress, computationID, options);

// Attempt to connect to the server
jiffClient.connect((success) => {
  if (success) {
    // Connection successful
    console.log('Connected to the server.');

    // Perform some computation
    const secret = 42; // Replace with your secret value
    const shares = jiffClient.share(secret);
    // You can perform more computations here using the shares
  } else {
    // Connection failed
    console.error('Failed to connect to the server.');
  }
});
