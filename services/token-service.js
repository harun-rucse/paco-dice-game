const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const generateJwtToken = (
  payload,
  option = { expiresIn: process.env.JWT_EXPIRES_IN }
) => {
  return jwt.sign(payload, process.env.JWT_SECRET, option);
};

const verifyJwtToken = (token) => {
  return promisify(jwt.verify)(token, process.env.JWT_SECRET);
};

const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = {
  generateJwtToken,
  verifyJwtToken,
  generateRandomToken,
  hashToken,
};
