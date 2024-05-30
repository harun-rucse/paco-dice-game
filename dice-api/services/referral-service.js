const {
  GAMINGREFERRAL,
  STAKINGREFERRAL,
  FAUCETREFERRAL,
  LOTTERYREFERRAL,
  MININGREFERRAL,
} = require("../constants/ReferralTypes");
const Referral = require("../models/Referral");
const AppError = require("../utils/app-error");
const decimal = require("./../utils/decimal");

const addReferral = async (
  type,
  amounts = {
    btc: "0",
    usdt: "0",
    paco: "0",
    eth: "0",
    bnb: "0",
  },
  account_id
) => {
  if (
    type !== GAMINGREFERRAL &&
    type !== STAKINGREFERRAL &&
    type !== FAUCETREFERRAL &&
    type !== LOTTERYREFERRAL &&
    type !== MININGREFERRAL
  ) {
    throw new AppError("Invalid referral type", 400);
  }

  //   find the referral type of the account or create a new one if it doesn't exist
  const referral = await Referral.findOne({ account: account_id, type });
  if (!referral) {
    const newReferral = new Referral({
      account: account_id,
      type,
      ...amounts,
    });
    return newReferral.save();
  } else {
    // add the amounts to the existing referral
    referral.btc = decimal.addition(referral.btc, amounts.btc);
    referral.usdt = decimal.addition(referral.usdt, amounts.usdt);
    referral.paco = decimal.addition(referral.paco, amounts.paco);
    referral.eth = decimal.addition(referral.eth, amounts.eth);
    referral.bnb = decimal.addition(referral.bnb, amounts.bnb);
  }
  return referral.save();
};

const claimReferral = async (account_id) => {
  const referrals = await Referral.find({ account: account_id });
  if (!referrals) {
    throw new AppError("No referral found", 404);
  }

  let totalBtc = "0";
  let totalUsdt = "0";
  let totalPaco = "0";
  let totalEth = "0";
  let totalBnb = "0";

  for (let referral of referrals) {
    totalBtc = decimal.addition(totalBtc, referral.btc);
    totalUsdt = decimal.addition(totalUsdt, referral.usdt);
    totalPaco = decimal.addition(totalPaco, referral.paco);
    totalEth = decimal.addition(totalEth, referral.eth);
    totalBnb = decimal.addition(totalBnb, referral.bnb);

    referral.btc = "0";
    referral.usdt = "0";
    referral.paco = "0";
    referral.eth = "0";
    referral.bnb = "0";

    referral.totalBnb = totalBnb;
    referral.totalUsdt = totalUsdt;
    referral.totalPaco = totalPaco;
    referral.totalEth = totalEth;
    referral.totalBnb = totalBnb;

    await referral.save();
  }

  return { totalBtc, totalUsdt, totalPaco, totalEth, totalBnb };
};

module.exports = {
  addReferral,
  claimReferral,
};
