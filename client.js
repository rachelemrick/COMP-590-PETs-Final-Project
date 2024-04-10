const { JIFFClient } = require('jiff-mpc');
const http = require('http');

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

// Connect to the server
jiffClient.connect(() => {
  // Share each value among the parties
  const sharedValues = [10, 20, 30, 40, 50].map(value => jiffClient.share(value));

  // Compute the sum of the shares of each value
  const sumShares = sharedValues.reduce((acc, share) => acc.sadd(share));

  // Divide the sum by the number of parties to get the average
  const numParties = jiffClient.party_count;
  const average = sumShares.cdiv(numParties);

  // Open the average to reveal the result
  jiffClient.open(average).then(result => {
    console.log('Average:', result);
    // You can perform further actions with the result here
  }).catch(error => {
    console.error('Error:', error);
  });

  // Send "hello" message to the server
  const helloMessage = 'Hello from the client!';
  const helloOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': helloMessage.length
    }
  };

  const helloReq = http.request(`${serverAddress}/hello`, helloOptions, res => {
    let responseData = '';
    res.on('data', chunk => {
      responseData += chunk;
    });
    res.on('end', () => {
      console.log('Response from server:', responseData);
    });
  });

  helloReq.on('error', error => {
    console.error('Error sending hello message:', error);
  });

  helloReq.write(helloMessage);
  helloReq.end();
});
