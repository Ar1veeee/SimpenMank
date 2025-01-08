const db = require("../config/db");

const getUserWallet = async (user_id) => {
  try {
    const [rows] = await db.query("SELECT * FROM wallets WHERE user_id = ?", [
      user_id,
    ]);
    return rows.map((row) => ({ ...row, balance: Number(row.balance) }));
  } catch (error) {
    console.error("Error fetching wallet list:", error);
    throw error;
  }
};

const getDefaultWallet = async (user_id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM wallets WHERE user_id IS NULL",
      [user_id]
    );
    return rows.map((row) => ({ ...row, balance: Number(row.balance) }));
  } catch (error) {
    console.error("Error fetching wallet list:", error);
    throw error;
  }
};

const getWalletDetail = async (user_id, wallet_id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM wallets WHERE id = ?",
      [user_id, wallet_id]
    );

    if (rows.length > 0) {
      return { ...rows[0], balance: Number(rows[0].balance) };
    }

    return null;
  } catch (error) {
    console.error("Error fetching wallet detail:", error);
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

    return { ...newWallet[0], balance: Number(newWallet[0].balance) };
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Error adding wallet:", error);
    throw error;
  }
};

const updateUserWallet = async (wallet_id, name, balance) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [result] = await connection.query(
      `UPDATE
      wallets SET name = ?,
      balance = ?
      WHERE id = ?`,
      [name, balance, wallet_id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    const [updateWallet] = await connection.query(
      "SELECT * FROM wallets WHERE id = ?",
      [wallet_id]
    );

    await connection.commit();
    return { ...updateWallet[0], balance: Number(updateWallet[0].balance) };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error update wallet:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const getWalletIdByName = async (wallet_name) => {
  try {
    const [rows] = await db.query("SELECT id FROM wallets WHERE name = ?", [
      wallet_name,
    ]);
    return rows.length > 0 ? rows[0].id : null;
  } catch (error) {
    console.error("Error fetching wallet ID by name:", error);
    throw error;
  }
};

module.exports = {
  getUserWallet,
  getDefaultWallet,
  getWalletDetail,
  addWallet,
  updateUserWallet,
  getWalletIdByName,
};
