const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` });
const app = require("./app");
const db = require("./config/db");

// database connection
db()
  .then(() => console.log("DB Connect successfull"))
  .catch((err) => console.log("DB Connect failed!", err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API is listening in [${process.env.NODE_ENV}] on port ${PORT}`);
});
