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

module.exports = {
    computeSum: computeSum,
    computeAverage: computeAverage,
};
