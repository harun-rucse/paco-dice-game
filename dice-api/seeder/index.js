const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const database = require("../config/db");
const TicketSettings = require("../models/TicketSettings");
const TicketTier = require("../models/TicketTier");
const TicketPool = require("../models/TicketPool");

database()
  .then(async () => {
    console.log("DB connection successful!");
    console.log(`--- Seeding to ${process.env.NODE_ENV} database ---`);

    // Remove ticket setting, ticket-tier and ticket pool collection
    await TicketSettings.deleteMany({});
    await TicketTier.deleteMany({});
    await TicketPool.deleteMany({});

    // seed ticket-setting data
    await TicketSettings.create({
      STANDARD: 100,
      MEGA: 200,
      round: 1,
    });

    console.log(`--- Completed ticket settings data seed ---`);

    // seed ticket-tier data
    await TicketTier.create({
      ONE: "150",
      TWO: "750",
      THREE: "2500",
      FOUR: "5000",
      FIVE: "10000",
      SIX: "100000",
      SEVEN: "1000000",
      EIGHT: "10000000",
      NINE: "100000000",
      TEN: "1000000000 ",
    });

    console.log(`--- Completed ticket tier data seed ---`);

    // Initiate ticket-pool
    await TicketPool.create({
      MINOR_JACKPOT: "1223358964",
      MEGA_JACKPOT: "10850600311",
      RESERVE: "0",
      BONUS: "0",
      TEAM: "0",
      PACO_BURNT: "0",
      FEE: "0",
    });

    console.log(`--- Completed ticket pool initiate ---`);

    process.exit();
  })
  .catch((err) => {
    console.log("DB Connect failed!", err);
    process.exit();
  });
