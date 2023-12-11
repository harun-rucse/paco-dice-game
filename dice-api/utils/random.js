const crypto = require("crypto");

function generateRandomNumber(seed, max = 100) {
  const buffer = crypto.randomBytes(32).toString("hex");

  const serverSeedBigInt = BigInt("0x" + seed);
  const bufferBigInt = BigInt("0x" + buffer);

  // Perform hexadecimal addition
  const sumBigInt = serverSeedBigInt + bufferBigInt;

  // Convert the result back to a 17-byte hexadecimal string
  let result = sumBigInt.toString(16);

  // Ensure the result is 17 bytes long
  const resultLength = result.length;
  if (resultLength < 34) {
    result = "0".repeat(34 - resultLength) + result; // Adding leading zeros if necessary
  }
  const randomSeed = result.slice(0, 17);
  const hash = crypto.createHash("sha256");
  hash.update(randomSeed);
  const hashedValue = hash.digest("hex");
  // Convert the first 8 characters of the hash to a decimal number
  const decimalValue = parseInt(hashedValue.substr(0, 8), 16);
  // Get the remainder when divided by max to get a number in the range of 0-max
  const number = decimalValue % max;

  return number;
}

// 1. Generate an initial server seed on server startup.
const serverSeed = crypto.randomBytes(32).toString("hex");
console.log("serverSeed", serverSeed);

function generateUniqueBet() {
  console.log("process.env.SERVER_SEED", process.env.SERVER_SEED);
  return process.env.SERVER_SEED;
}

let randomNumbers = [];
for (i = 0; i < 100; i++) {
  const random = generateRandomNumber(generateUniqueBet(i), 100);
  randomNumbers.push(random);
}

// canculate repetation of each number
let count = {};
randomNumbers.forEach(function (i) {
  count[i] = (count[i] || 0) + 1;
});

// console.log(count);
