const db = require("../config/db");

exports.testAPI = (req, res) => {
  const startTime = Date.now();

  res.status(200).json({
    message: "API is working",
    timestamp: new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }),
    responseTime: `${Date.now() - startTime}ms`,
  });
};

exports.testDB = async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({
      message: "Connected to Database",
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
};
