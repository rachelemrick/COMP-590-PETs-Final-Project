const { QUESTIONS_COUNT } = require("../constants.js")

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

async function computeSumArr(jiffClient, party_count) {
  let shares = [];

  for (let i = 2; i <= party_count; i++) {
    shares[i] = jiffClient.share_array(null, QUESTIONS_COUNT, 2, [1, 's1'], [i])[i];
  }

  let values = [];
  let array;

  await Promise.all(shares).then((arr) => {

    for (let i = 2; i < arr.length; i++) {
      if (arr[i]) {
        values.push(arr[i]);
      }
    }

    // Sum all shared input arrays element wise
    array = values[0];

    for (let p = 1; p < values.length; p++) {
      for (let i = 0; i < array.length; i++) {
        array[i] = array[i].sadd(values[p][i]);
      }
    }
  });

  // Open the array
  if (array != null) {
    return jiffClient.open_array(array), ['s1'];
  }

}

module.exports = {
    computeSum: computeSum,
    computeAverage: computeAverage,
    computeSumArr: computeSumArr,
};
