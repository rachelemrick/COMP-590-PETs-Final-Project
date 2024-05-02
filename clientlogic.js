// var JIFFClient = require('../../lib/jiff-client.js');
const { JIFFClient } = require('jiff-mpc');
const { QUESTIONS_COUNT } = require("./constants.js");

function clientlogic(input)
{
  var jiffClient = new JIFFClient('http://localhost:8080', 'web-mpc');

  // Wait for server to connect
  jiffClient.wait_for([1, 's1'], function () {
    console.log('Connected! ID: ' + jiffClient.id);
    jiffClient.share(input, 2, [1, 's1'], [ jiffClient.id ]);
    console.log('Shared input!');
    jiffClient.disconnect(true, true);
    console.log('Disconnected!');
  });

}

function clientShareArray(inputArr)
{
  var jiffClient = new JIFFClient('http://localhost:8080', 'web-mpc');

  // Wait for server to connect
  jiffClient.wait_for([1, 's1'], function () {
    console.log('Connected! ID: ' + jiffClient.id);

    // share the array
    jiffClient.share_array(input, QUESTIONS_COUNT, 2, [1, 's1'], [ jiffClient.id ]).then((arr) => {
      console.log('Shared input! ', input);
      jiffClient.disconnect(true, true);
      console.log('Disconnected!');
    });
  });
}

module.exports = {
  clientlogic: clientlogic,
  clientShareArray: clientShareArray,
}
