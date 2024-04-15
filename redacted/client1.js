const { JIFFClient } = require('jiff-mpc');

// Define the server address
const serverAddress = 'http://localhost:3000'; // Replace with your server address

// Define the computation ID
const computationID = 'example_computation'; // Replace with your computation ID

// Define options for the JIFF client
const options = {
  party_id: 1, // Replace with your party ID
  party_count: 2 // Specify the total number of parties involved in the computation
  // Add any other options as needed
};

// Create a JIFF client instance
const jiffClient = new JIFFClient(serverAddress, computationID, options);

// Create a secret share
var share = new jiffClient.SecretShare(10, [1], 1, jiffClient.Zp);

// Connect to the server
jiffClient.connect(() => {
  console.log('Connected to the server');

  // Open the share
  share.open([1]).then((val) => {
    console.log(`The share is ${val}`);
  }).catch(error => {
    console.error('Error opening the share:', error);
  });
});
