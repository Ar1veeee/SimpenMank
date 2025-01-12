const db = require("../config/db");

const getUserWallet = async (user_id) => {
  try {
    const [rows] = await db.query("SELECT * FROM wallets WHERE user_id = ?", [
      user_id,
    ]);
    return rows.map((row) => ({ 
      ...row, 
      balance: Number(row.balance),
      created_at: row.created_at
        ? new Date(row.created_at).toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        : null,
     }));
  } catch (error) {
    console.error("Error fetching wallet list:", error);
    throw error;
  }
};

const getWalletDetail = async (user_id, wallet_id) => {
  try {
    const [rows] = await db.query(
      "SELECT name, balance FROM wallets WHERE user_id = ? AND id = ?",
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

const addWallet = async (user_id, name) => {
  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO wallets (user_id, name) VALUES (?,?)",
      [user_id, name]
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

const updateUserWallet = async (user_id, wallet_id, wallet_name) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [result] = await connection.query(
      `UPDATE
      wallets SET name = ?
      WHERE user_id = ? AND id = ?`,
      [wallet_name, user_id, wallet_id]
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

const deleteUserWallet = async (user_id, wallet_id) => {
  const [result] = await db.query(
    "DELETE FROM wallets WHERE user_id = ? AND id = ?",
    [user_id, wallet_id]
  );
  return result.affectedRows > 0;
};

const createDefaultWallets = async (user_id) => {
  const defaultWallets = [
    { name: "Cash", balance: 0 },
    { name: "Bank Accounts", balance: 0 },
    { name: "Card", balance: 0 },
  ];

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    for (const wallet of defaultWallets) {
      await connection.query(
        `INSERT INTO wallets (user_id, name, balance) 
         VALUES (?, ?, ?)`,
        [user_id, wallet.name, wallet.balance]
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getWalletIdByName = async (wallet_name, user_id) => {
  try {
    const [rows] = await db.query("SELECT id FROM wallets WHERE name = ? AND user_id = ?", [
      wallet_name, user_id,
    ]);
    return rows.length > 0 ? rows[0].id : null;
  } catch (error) {
    console.error("Error fetching wallet ID by name:", error);
    throw error;
  }
};

module.exports = {
  getUserWallet,
  getWalletDetail,
  addWallet,
  updateUserWallet,
  deleteUserWallet,
  getWalletIdByName,
  createDefaultWallets,
};
