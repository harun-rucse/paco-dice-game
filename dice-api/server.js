const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` });
const app = require("./app");
const db = require("./config/db");
const { listEvent } = require("./services/event-service");
const Web3 = require("web3");

let web3 = new Web3(process.env.RPC);
// database connection
db()
  .then(() => console.log("DB Connect successfull"))
  .catch((err) => console.log("DB Connect failed!", err));

// lister event
// listEvent(web3);

web3?.currentProvider?.connection.addEventListener("end", () => {
  console.error("WebSocket connection closed unexpectedly");
  web3 = new Web3(process.env.RPC);
  listEvent(web3);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API is listening in [${process.env.NODE_ENV}] on port ${PORT}`);
});
