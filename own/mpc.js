const P = 2**31-1;

function compute(inputArr) {
  var summ = 0;

  for (let i = 0; i < inputArr.length; i++) {
    summ = (summ + inputArr[i]) % P;
  }

  const mean = summ / inputArr.length;
  return mean;
}

module.exports = {
  compute: compute,
}
