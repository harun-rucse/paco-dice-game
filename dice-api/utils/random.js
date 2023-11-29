const crypto = require("crypto");

function generateRandomNumber(seed, max = 100) {
  // Generate a cryptographically secure random buffer of 16 bytes
  const buffer = crypto.randomBytes(16);

  // Create a SHA256 hash of this buffer
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  const hashedValue = hash.digest("hex") + seed;

  // Convert the first 8 characters of the hash to a decimal number
  const decimalValue = parseInt(hashedValue.substr(0, 8), 16);

  // Get the remainder when divided by max to get a number in the range of 0-max
  const number = decimalValue % max;

  return number;
}

// 1. Generate an initial server seed on server startup.
const serverSeed = crypto.randomBytes(32).toString("hex");

let nonce = 0; // This should be maintained, possibly in a database, and incremented with each bet

function generateUniqueBet(userSeed) {
  nonce++;

  // Concatenate the server seed, user seed, and nonce to get a unique string for each bet
  const betString = serverSeed + userSeed + nonce;

  // Hash the unique bet string to get a fixed-length, unique identifier for the bet
  const hash = crypto.createHash("sha256");
  hash.update(betString);
  const betID = hash.digest("hex");

  return betID;
}
let randomNumbers = [];
for (i = 0; i < 500; i++) {
  const random = generateRandomNumber(generateUniqueBet(i), 100);
  randomNumbers.push(random);
}

// canculate repetation of each number
let count = {};
randomNumbers.forEach(function (i) {
  count[i] = (count[i] || 0) + 1;
});

console.log(count);
