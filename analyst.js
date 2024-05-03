// Dependencies
var path = require('path');
var fs = require('fs');
var readline = require('readline');

// var JIFFClient = require('../../lib/jiff-client.js');
const { JIFFClient } = require('jiff-mpc');
const { computeAverage, computeSum } = require('./functions/arithmetic.js');

//DB
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017'; 
const dbName = "mpc_db";
let database;
let shares;

const mongoClient = new MongoClient(uri);
// Handle storing and loading keys
var KEYS_FILE = 'keys.json';
function save_keys(jiffClient) {
  var public_key = '['+jiffClient.public_key.toString()+']';
  var secret_key = '['+jiffClient.secret_key.toString()+']';
  var obj = '{ "public_key": ' + public_key + ', "secret_key": ' + secret_key + '}';
  fs.writeFileSync(path.join(__dirname, KEYS_FILE), obj);
}

function load_keys() {
  try {
    var obj = require('./' + KEYS_FILE);
    obj.secret_key = new Uint8Array(obj.secret_key);
    obj.public_key = new Uint8Array(obj.public_key);
    return obj;
  } catch (err) {
    // key file does not exist
    return { public_key: null, secret_key: null };
  }
}

async function fetchShares() {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const sharesCollection = db.collection('Shares');
    shares = await sharesCollection.find().toArray();
    client.close();
    console.log(shares);
    return shares;
  } catch (err) {
    console.error('Error fetching shares from the database:', err);
    throw err;
  }
}

// For reading actions from the command line
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Options for creating the jiff instance
var options = {
  crypto_provider: true, // do not bother with preprocessing for this demo
  party_id: 1, // we are the analyst => we want party_id = 1
  socketOptions: {
    reconnectionDelay: 3000,
    reconnectionDelayMax: 4000
  }
};

//DB CONNECTION
async function connectToMongoDB() {
  console.log('Attempting to connect to MongoDB...');
  try {
      // Connect to the server
      await mongoClient.connect();
      // You can access the database like this
      database = mongoClient.db(dbName);
      console.log('database connection successful!');
      // You can access collections from the database like this
      // const collection = database.collection('your_collection_name');

      // If you need to close the connection later
      // await client.close();
  } catch (error) {
      console.error('Error connecting to MongoDB:', error);
  }
}

// Load the keys in case they were previously saved (otherwise we get back nulls)
var keys = load_keys();
options.public_key = keys.public_key;
options.secret_key = keys.secret_key;

function startAnalyst() {
  // Create the instance
  var jiffClient = new JIFFClient('http://localhost:8080', 'web-mpc', options);
  // Wait for server to connect
  jiffClient.wait_for(['s1'], function () {
    save_keys(jiffClient); // save the keys in case we need them again in the future

    // Wait for user input
    console.log('Computation initialized!');
    console.log('Hit enter when you decide it is time to compute!');
    rl.on('line', function (_) {
      // Send begin signal
      jiffClient.emit('begin', [ 's1' ], '');

      // Receive number of parties from server
      jiffClient.listen('number', function (_, party_count) {
        // Computation starts
        party_count = parseInt(party_count);
        console.log('BEGIN: # of parties ' + party_count);
        //Pull shares from db
        fetchShares();
        computeAverage(jiffClient, party_count).then((mean) => {
        // Store the mean in the MongoDB database
        const collection = database.collection('Mean Calculation'); // Replace with your collection name
        const data = { mean: mean };
        collection.insertOne(data)
          .then(result => {
            console.log(`Mean ${mean} inserted into the database with ID: ${result.insertedId}`);
            jiffClient.disconnect(true, true);
            rl.close();
          })
          .catch(err => {
            console.error('Error inserting mean into the database:', err);
            jiffClient.disconnect(true, true);
            rl.close();
          });
})
.catch(error => {
  console.error('Error computing average:', error);
});
      });
    });
  });
}

module.exports = {
  startAnalyst: startAnalyst,
  connectToMongoDB: connectToMongoDB,
}
