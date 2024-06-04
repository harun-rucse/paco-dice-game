const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const database = require("../config/db");
const Account = require("../models/Account");
const ReferralEarned = require("../models/ReferralEarned");

async function generateUniqueReferralCode() {
  let referralCode;
  let isUnique = false;

  while (!isUnique) {
    referralCode = generateReferralCode();
    const existingAccount = await Account.findOne({ referralCode });
    if (!existingAccount) {
      isUnique = true;
    }
  }

  return referralCode;
}

function generateReferralCode(length = 12) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

database()
  .then(async () => {
    console.log("DB connection successful!");
    console.log(`--- Script running for ${process.env.NODE_ENV} mode ---`);

    // Find all accounts which have referralCode as an empty string or do not have this field
    const accounts = await Account.find({
      $or: [{ referralCode: "" }, { referralCode: { $exists: false } }],
    });

    // Generate a unique referral code for each account and save it
    for (let account of accounts) {
      const referralCode = await generateUniqueReferralCode();
      account.referralCode = referralCode;
      await account.save();

      // Initialize referral earned document for each account
      const referralEarned = new ReferralEarned();
      referralEarned.account = account._id;
      await referralEarned.save();
    }

    console.log(
      "--- Referral codes & referral earned generated and saved for accounts ---"
    );
    process.exit();
  })
  .catch((err) => {
    console.log("DB Connect failed!", err);
    process.exit();
  });
