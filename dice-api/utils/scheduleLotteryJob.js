const cron = require("node-cron");
const ticketController = require("../controllers/ticket");

function scheduleLotteryJob() {
  // run daily at 3:00 PM
  cron.schedule("0 15 * * *", async () => {
    await ticketController.transferDailyTicketToTicketPool();
    console.log("Lottery draw");
  });
}

module.exports = scheduleLotteryJob;
