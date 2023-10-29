const express = require("express");
const cors = require("cors");
const accountController = require("./controllers/account");
const authController = require("./controllers/auth");
const gameController = require("./controllers/game");
const { auth } = require("./middlewares/auth");
const globalErrorHandler = require("./controllers/error");
const AppError = require("./utils/app-error");

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.get("/api/hello", gameController.hello);
app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);
app.get("/api/auth/current-user", auth, authController.currentUser);
app.post("/api/games", auth, gameController.createGame);
app.get("/api/games", auth, gameController.getGamesHistory);
app.patch("/api/account/deposite", auth, accountController.deposite);
app.patch("/api/account/withdraw", auth, accountController.withdraw);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.method} ${req.originalUrl} on this server.`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
