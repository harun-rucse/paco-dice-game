const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const database = require("../config/db");
const Faucet = require("../models/Faucet");
const Account = require("../models/Account");

database()
  .then(async () => {
    console.log("DB connection successful!");
    console.log(`--- Script running for ${process.env.NODE_ENV} mode ---`);

    const accounts = await Account.find();

    for (let account of accounts) {
      const faucet = new Faucet({
        account: account._id,
      });

      await faucet.save();
    }

    process.exit();
  })
  .catch((err) => {
    console.log("DB Connect failed!", err);
    process.exit();
  });
