async function computeSum(jiffClient, party_count) {
  // Receive shares from all parties that submitted
  var shares = {};
  for (var i = 2; i <= party_count; i++) {
    shares[i] = jiffClient.share(null, 2, [1, 's1'], [ i ])[i];
  }

  // Sum everyone's shares
  var sum = shares[2];
  for (var p = 3; p <= party_count; p++) {
    sum = sum.sadd(shares[p]);
  }
  // Open the resulting sum only to the analyst
  return jiffClient.open(sum, [1]);
};

async function computeAverage(jiffClient, party_count) {
  // compute Sum
  const sum = await computeSum(jiffClient, party_count);
  const average = sum / (party_count - 1); // exclude the analyst
  return average;
}

async function computeCorrelation(x_array, y_array) {
  // compute Correlation btwn two variables when both are stored as arrays
  // First find their averages
  x_mean = computeAverageOfArray(x_array);
  y_mean = computeAverageOfArray(y_array);

  // TODO: finish using JIFF commands
}

function computeAverageOfArray(array) {
  // TODO: does this need to be changed to use JIFF commands?
  sum = 0
  for (element of array) {
    sum += element
  }
  return sum / array.length
}

module.exports = {
    computeSum: computeSum,
    computeAverage: computeAverage,
};
