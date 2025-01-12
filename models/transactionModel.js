const db = require("../config/db");

const getUserTransactions = async (user_id) => {
  try {
    const [rows] = await db.query(
      `
    SELECT 
      t.id as transaction_id,
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
    return rows.map((row) => ({ 
      ...row, 
      amount: Number(row.amount),
      transaction_date: row.transaction_date
        ? new Date(row.transaction_date).toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : null,
     }));
  } catch (error) {}
};

const getMonthlyReport = async (user_id) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [results] = await connection.query(
      `SELECT 
        DATE_FORMAT(transaction_date, '%Y-%m') AS month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
        (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) AS net_balance
      FROM transactions
      WHERE user_id = ?
      GROUP BY month
      ORDER BY month DESC`,
      [user_id]
    );

    await connection.commit();
    return results;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error fetching monthly transactions:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const updateUserTransactions = async (
  user_id,
  transaction_id,
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
      `UPDATE 
      transactions SET wallet_id = ?, 
      category_id = ?, 
      amount = ?, 
      description = ?, 
      transaction_date = ?, 
      type = ?
      WHERE user_id = ? AND id = ?`,
      [
        wallet_id,
        category_id,
        amount,
        description,
        transaction_date,
        type,
        user_id,
        transaction_id,
      ]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    const [updateTransaction] = await connection.query(
      "SELECT * FROM transactions WHERE id = ?",
      [transaction_id]
    );

    await updateWalletBalancesForWallet(connection, wallet_id);

    await connection.commit();
    return updateTransaction[0];
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error update transaction:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const getTransactionDetail = async (user_id, transaction_id) => {
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
    WHERE t.user_id = ? AND t.id = ?
    `,
    [user_id, transaction_id]
  );
  return rows.map((rows) => ({ 
    ...rows, 
    amount: Number(rows.amount),
    transaction_date: rows.transaction_date
      ? new Date(rows.transaction_date).toLocaleString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null,
   }));
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

    await updateWalletBalancesForWallet(connection, wallet_id);

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

const updateWalletBalancesForWallet = async (connection, wallet_id) => {
  const [balance] = await connection.query(
    `SELECT 
        wallet_id,
        (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) AS net_balance
    FROM transactions
    WHERE wallet_id = ?
    GROUP BY wallet_id`,
    [wallet_id]
  );

  if (balance.length > 0) {
    await connection.query(
      `UPDATE wallets 
       SET balance = ? 
       WHERE id = ?`,
      [balance[0].net_balance, wallet_id]
    );
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
  getTransactionDetail,
  updateUserTransactions,
  addTransaction,
  deleteUserTransaction,
  getMonthlyReport,
};
