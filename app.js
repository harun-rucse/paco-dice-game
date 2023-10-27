const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` });
const controllers = require("./controllers");
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// database connection
db()
  .then(() => console.log("DB Connect successfull"))
  .catch((err) => console.log("DB Connect failed!", err));

// routes
app.get("/api/hello", controllers.hello);
app.post("/api/register", controllers.register);
app.post("/api/login", controllers.login);
app.post("/api/games", controllers.createGame);
app.get("/api/games", controllers.getGamesHistory);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
