const db = require("../config/db");

const getListWallet = async (user_id) => {
  try {
    const [rows] = await db.query("SELECT * FROM wallets WHERE user_id = ?", [
      user_id,
    ]);
    return rows;
  } catch (error) {
    console.error("Error fetching wallet list:", error);
    throw error;
  }
};

const addWallet = async (user_id, name, balance) => {
  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO wallets (user_id, name, balance) VALUES (?,?,?)",
      [user_id, name, balance]
    );

    const [newWallet] = await connection.query(
      "SELECT * FROM wallets WHERE id = ?",
      [result.insertId]
    );

    await connection.commit();
    connection.release();

    return newWallet[0];
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Error adding wallet:", error);
    throw error;
  }
};

const getWalletIdByName = async (wallet_name) => {
  try {
    const [rows] = await db.query(
      "SELECT id FROM wallets WHERE name = ?",
      [wallet_name]
    );
    return rows.length > 0 ? rows[0].id : null;
  } catch (error) {
    console.error("Error fetching wallet ID by name:", error);
    throw error;
  }
};

module.exports = { getListWallet, addWallet, getWalletIdByName };