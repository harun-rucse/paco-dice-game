const cron = require("node-cron");
const stakeController = require("../controllers/stake");

function scheduleStakingJob() {
  // run daily at 12:00 AM (midnight)
  cron.schedule("0 0 * * *", async () => {
    await stakeController.transferPoolToStakeHolder();
    console.log("Transfer pool to stake holder");
  });
}

module.exports = scheduleStakingJob;
