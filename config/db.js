const mysql = require("mysql2/promise");
require("dotenv-safe").config();

console.log("Initializing database connection pool...");

/* eslint-disable no-undef */
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("Database connection pool initialized.");

module.exports = db;
