const cron = require("node-cron");
const faucetController = require("../controllers/faucet");

function scheduleFaucetJob() {
  // run daily at 12:00 AM (midnight)
  cron.schedule("0 23 * * *", async () => {
    await faucetController.transferFaucetPrize();
    console.log("Transfer faucet prize");
  });
}

module.exports = scheduleFaucetJob;
