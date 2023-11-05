const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const accountRoutes = require("./routes/accountRoutes");
const globalErrorHandler = require("./controllers/error");
const AppError = require("./utils/app-error");

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/account", accountRoutes);

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
