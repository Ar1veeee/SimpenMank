const express = require("express");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const testRoutes = require("./routes/testRoutes");
const walletRoutes = require("./routes/walletRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/trasactionsRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("./config/passport");
require("dotenv").config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
});

app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/profile", profileRoutes);
app.use("/transaction", transactionRoutes);
app.use("/wallet", walletRoutes);
app.use("/category", categoryRoutes);
app.use("/budget", budgetRoutes);
app.use("/test", testRoutes);

module.exports = app;
