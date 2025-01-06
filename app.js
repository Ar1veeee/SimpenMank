const express = require("express");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const testRoutes = require("./routes/testRoutes");
const walletRoutes = require("./routes/walletRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/trasactionsRoutes");
require("./config/passport");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/auth", userRoutes);
app.use("/profile", profileRoutes);
app.use("/transaction", transactionRoutes);
app.use("/wallet", walletRoutes);
app.use("/category", categoryRoutes);
app.use("/test", testRoutes);

module.exports = app;
