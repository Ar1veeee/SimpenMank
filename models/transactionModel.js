const db = require("../config/db");

const getUserTransactions = async (user_id) => {
  const [rows] = await db.query(
    `
    SELECT 
      t.transaction_date, 
      t.amount, 
      c.name AS category_name, 
      w.name AS wallet_name, 
      t.description
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    JOIN wallets w ON t.wallet_id = w.id
    WHERE t.user_id = ?
    `,
    [user_id]
  );
  return rows;
};

const getTransactionDetails = async (user_id, transaction_id) => {
  const [rows] = await db.query(
    `
    SELECT * FROM transactions WHERE user_id = ? AND id = ?
    `,
    [user_id, transaction_id]
  );
  return rows;
};

const addTransaction = async (
  user_id,
  wallet_id,
  category_id,
  amount,
  description,
  transaction_date,
  type
) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO transactions (user_id, wallet_id, category_id, amount, description, transaction_date, type) VALUES (?,?,?,?,?,?,?)",
      [
        user_id,
        wallet_id,
        category_id,
        amount,
        description,
        transaction_date,
        type,
      ]
    );

    const [newTransaction] = await connection.query(
      "SELECT * FROM transactions WHERE id = ?",
      [result.insertId]
    );

    await connection.commit();
    return newTransaction[0];
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error adding transaction:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const deleteUserTransaction = async (user_id, transaction_id) => {
  const [result] = await db.query(
    "DELETE FROM transactions WHERE user_id = ? AND id = ?",
    [user_id, transaction_id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  getUserTransactions,
  getTransactionDetails,
  addTransaction,
  deleteUserTransaction,
};
