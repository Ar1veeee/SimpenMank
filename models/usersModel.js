const { hash } = require("bcrypt");
const db = require("../config/db");

const QUERY_FIND_USER_BY_GOOGLE_ID = "SELECT * FROM users WHERE google_id = ?";
const QUERY_INSERT_USER =
  "INSERT INTO users (google_id, username, email, auth_method) VALUES (?, ?, ?, ?)";
const QUERY_FIND_USER_BY_ID = "SELECT * FROM users WHERE id = ?";
const QUERY_FIND_USER_BY_EMAIL = "SELECT * FROM users WHERE email = ?";
const QUERY_INSERT_USER_WITH_PASSWORD =
  "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
const QUERY_UPDATE_USER_PASSWORD = "UPDATE users SET password = ? WHERE id = ?";

const findOrCreateUser = async (profile) => {
  const { id: google_id, displayName, emails } = profile;
  const email = emails[0].value;

  const [[existingUser]] = await db.query(QUERY_FIND_USER_BY_GOOGLE_ID, [
    google_id,
  ]);
  if (existingUser) return existingUser;

  const [result] = await db.query(QUERY_INSERT_USER, [
    google_id,
    displayName,
    email,
    "google",
  ]);

  return {
    id: result.insertId,
    google_id,
    username: displayName,
    email,
    auth_method: "google",
  };
};

const createUser = async (username, email, password) => {
  const hashedPassword = await hash(password, 10);
  const [result] = await db.query(QUERY_INSERT_USER_WITH_PASSWORD, [
    username,
    email,
    hashedPassword,
  ]);

  const [[newUser]] = await db.query(QUERY_FIND_USER_BY_ID, [result.insertId]);
  return newUser;
};

const updateUserPassword = async (user_id, password) => {
  const newHashedPassword = await hash(password, 10);
  const [result] = await db.query(QUERY_UPDATE_USER_PASSWORD, [
    newHashedPassword,
    user_id,
  ]);
  return result;
};

const findUserByEmail = async (email) => {
  const [[user]] = await db.query(QUERY_FIND_USER_BY_EMAIL, [email]);
  return user;
};

const findUserById = async (user_id) => {
  const [[user]] = await db.query(QUERY_FIND_USER_BY_ID, [user_id]);
  return user;
};

module.exports = {
  findOrCreateUser,
  createUser,
  updateUserPassword,
  findUserById,
  findUserByEmail,
};
