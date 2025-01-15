const app = require("./app");
require("dotenv-safe").config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});