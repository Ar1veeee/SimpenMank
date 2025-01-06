const db = require('../config/db');

exports.testAPI = (req, res) => {
    res.status(200).json({
        message:"API is working",
        timestamp: new Date().toISOString(),
    });
};

exports.testDB = async (req, res) => {
    try {        
        await db.query("SELECT 1");
        res.status(200).json({
            message: "Database connection successful"
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });
    }
};
