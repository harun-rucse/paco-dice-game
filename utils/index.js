const crypto = require("crypto");

function generateRandomNumber(seed, max = 99) {
  // Generate a cryptographically secure random buffer of 16 bytes
  const buffer = crypto.randomBytes(16);

  // Create a SHA256 hash of this buffer
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  const hashedValue = hash.digest("hex") + seed;

  // Convert the hash to a number and get it in the range of 1-max
  const number = (parseInt(hashedValue, 16) % max) + 1;

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

module.exports = { generateRandomNumber, generateUniqueBet };
