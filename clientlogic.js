// Read command line arguments
// var input = parseInt(process.argv[2], 10);

// var JIFFClient = require('../../lib/jiff-client.js');
const { JIFFClient } = require('jiff-mpc');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const dbName = "mpc_db";
let database;
const mongoClient = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await mongoClient.connect();
    database = mongoClient.db(dbName);
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

function clientlogic(input) {
  const jiffClient = new JIFFClient('http://localhost:8080', 'web-mpc');

  jiffClient.wait_for([1, 's1'], async function () {
    console.log('Connected! ID: ' + jiffClient.id);

    await connectToMongoDB(); // Connect to MongoDB before sharing input

    const share = await jiffClient.share(input, 2, [1, 's1'], [jiffClient.id]);

    const collection = database.collection('Shares'); // Replace with your collection name
    const shareData = { party: jiffClient.id, share: share };

    try {
      const result = await collection.insertOne(shareData);
      console.log(`Share inserted into the database with ID: ${result.insertedId}`);
    } catch (err) {
      console.error('Error inserting share into the database:', err);
    }

    console.log('Shared input!');
    jiffClient.disconnect(true, true);
    console.log('Disconnected!');
  });
}

module.exports = {
  clientlogic: clientlogic,
};