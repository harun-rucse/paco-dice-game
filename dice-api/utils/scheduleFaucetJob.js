const cron = require("node-cron");
const faucetController = require("../controllers/faucet");

function scheduleFaucetJob() {
  // run daily at 11:00 PM (midnight)
  cron.schedule("0 22 * * *", async () => {
    await faucetController.transferFaucetPrize();
    console.log("Transfer faucet prize");
  });
}

module.exports = scheduleFaucetJob;
