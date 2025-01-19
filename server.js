const app = require("./app");
require("dotenv-safe").config();
/* eslint-disable no-undef */
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    try {
      await db.end();
      console.log("Database connection pool closed.");
      process.exit(0);
    } catch (err) {
      console.error("Error during database shutdown:", err);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));