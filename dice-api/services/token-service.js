const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const AppError = require("../utils/app-error");

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = (token, account_id) => {
  const newToken = new Token({ token, account: account_id });
  return newToken.save();
};

const removeRefreshToken = (account_id) => {
  return Token.findOneAndDelete({ account: account_id });
};

const findRefreshToken = (token, account_id) => {
  return Token.findOne({ token, account: account_id });
};

const verifyAccessToken = async (token) => {
  try {
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    return decoded;
  } catch (err) {
    console.log("Reach custom err!");
    throw new AppError("Token has expired. Please login again.", 401);
  }
};

const verifyRefreshToken = async (token) => {
  try {
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.REFRESH_TOKEN_SECRET
    );
    return decoded;
  } catch (err) {
    throw new AppError("Token has expired. Please login again.", 401);
  }
};

const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = {
  generateRandomToken,
  hashToken,
  generateTokens,
  storeRefreshToken,
  removeRefreshToken,
  findRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
