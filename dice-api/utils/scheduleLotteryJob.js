const cron = require("node-cron");
const ticketController = require("../controllers/ticket");

function scheduleLotteryJob() {
  // run daily at 3:00 AM (midnight)
  cron.schedule("0 2 * * *", async () => {
    await ticketController.transferDailyTicketToTicketPool();
    console.log("Lottery draw");
  });
}

module.exports = scheduleLotteryJob;
