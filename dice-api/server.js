const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` });
const app = require("./app");
const db = require("./config/db");
const { listEvent } = require("./services/event-service");
const Web3 = require("web3");
const scheduleStakingJob = require("./utils/scheduleStakingJob");
const scheduleLotteryJob = require("./utils/scheduleLotteryJob");

// database connection
db()
  .then(() => console.log("DB Connect successfull"))
  .catch((err) => console.log("DB Connect failed!", err));

// Schedule automatic transfer stake pool to stake holder
scheduleStakingJob();

// Schedule automatic transfer daily ticket to ticket pool & distribute reward
scheduleLotteryJob();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API is listening in [${process.env.NODE_ENV}] on port ${PORT}`);

  let provider = new Web3.providers.WebsocketProvider(process.env.RPC, {
    clientConfig: {
      keepalive: true,
      keepaliveInterval: 60000,
    },
    reconnect: {
      auto: true,
      delay: 5000,
      maxAttempts: 5,
      onTimeout: false,
    },
  });

  const web3 = new Web3(provider);
  // lister event
  listEvent(web3);

  // avoid websocket connection go idle
  web3?.eth
    ?.subscribe("newBlockHeaders")
    .on("data", (data) => {
      // console.log(`Received block header for block number ${data.number}.`);
    })
    .on("error", (error) => {
      console.error(error);
      console.error("An error on the new blocks subscription.");
    })
    .on("connected", (id) => {
      console.log(`NewBlockHeaders subscription connected (${id})`);
    });
});
