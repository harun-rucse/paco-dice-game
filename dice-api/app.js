const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const accountRoutes = require("./routes/accountRoutes");
const globalErrorHandler = require("./controllers/error");
const AppError = require("./utils/app-error");

const corsOptions = {
  origin: ["http://localhost:3000", "https://game.paco.finance"],
  credentials: true,
};

const app = express();

// middleware to allow proxying of cookies
app.enable("trust proxy");

// Enable CORS request
app.use(cors(corsOptions));

// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

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
