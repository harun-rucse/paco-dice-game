const Account = require("../models/Account");
const tokenService = require("../services/token-service");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");

const auth = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (req.cookies?.access_token) {
    token = req.cookies?.access_token;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await tokenService.verifyAccessToken(token);

  // 3) Check if user still exists
  const currentAccount = await Account.findOne({ _id: decoded.id });
  if (!currentAccount) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentAccount.passwordChangeAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // ACCESS TO PROTECTED ROUTE
  req.account = currentAccount;

  next();
});

const checkAuth = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (req.cookies?.access_token) {
    token = req.cookies?.access_token;
  }

  if (!token) return next();

  // 2) Verification token
  const decoded = await tokenService.verifyAccessToken(token);

  // 3) Check if user still exists
  const currentAccount = await Account.findOne({ _id: decoded.id });
  if (!currentAccount) return next();

  // 4) Check if user changed password after the token was issued
  if (currentAccount.passwordChangeAfter(decoded.iat)) return next();

  // ACCESS TO PROTECTED ROUTE
  req.account = currentAccount;

  next();
});

const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (roles.includes(req.account.role)) {
      return next();
    }

    return next(
      new AppError("You don't have permission to perform this.", 403)
    );
  });
};

module.exports = { auth, restrictTo, checkAuth };
