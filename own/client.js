const P = 2**31-1;

function shareInput(input) {
  const randInt = Math.random();

  const s1 = (input / 2 - randInt) % P;
  const s2 = (input / 2 + randInt) % P;

  return [s1, s2];
}

module.exports = {
  shareInput: shareInput,
}
