const express = require("express");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const testRoutes = require("./routes/testRoutes");
const walletRoutes = require("./routes/walletRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/trasactionsRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const goalRoutes = require("./routes/goalRoutes");
const firebaseRoutes = require("./routes/firebaseTestRoutes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const hpp = require("hpp");
const morgan = require("morgan");
const logger = require("./middlewares/logger")
require("./config/passport");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});
const morganFormat = ":method :url :status :response-time ms";

app.use(limiter);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
    },
  })
);
app.use(compression());
app.use(cookieParser());
app.use(hpp());
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
app.use(express.json());

app.use("/auth",authLimiter, userRoutes);
app.use("/profile", profileRoutes);
app.use("/transaction", transactionRoutes);
app.use("/wallet", walletRoutes);
app.use("/category", categoryRoutes);
app.use("/budget", budgetRoutes);
app.use("/goal", goalRoutes);
app.use("/health", testRoutes);
app.use("/firebase", firebaseRoutes);

app.use((err, res) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
