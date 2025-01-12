const db = require("../config/db");

const getDateRange = (period) => {
  const today = new Date();
  let startDate, endDate;

  if (period === "weekly") {
    startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay());

    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  } else if (period === "monthly") {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  } else if (period === "annually") {
    startDate = new Date(today.getFullYear(), 0, 1);
    endDate = new Date(today.getFullYear(), 11, 31);
  }

  return { startDate, endDate };
};

const budgetList = async (user_id, period) => {
  const { startDate, endDate } = getDateRange(period);
  try {
    const [rows] = await db.query(
      `SELECT           
          c.id AS category_id,
          c.name AS category_name,
          c.limit_amount,          
          SUM(t.amount) as total_amount,
        COALESCE(c.limit_amount - SUM(t.amount), c.limit_amount) AS remaining_budget        
        FROM categories c
        LEFT JOIN transactions t 
          ON c.id = t.category_id 
          AND t.transaction_date BETWEEN ? AND ?
        WHERE c.user_id = ? AND t.type = "expense"
        GROUP BY c.id`,
      [startDate, endDate, user_id]
    );

    const result = rows.map((row) => ({
      ...row,
      limit_amount: Number(row.limit_amount),
      total_amount: Number(row.total_amount),
      remaining_budget: Number(row.remaining_budget),
    }));
    return result;
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
};

const editLimitAmount = async (user_id, category_id, limit_amount) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [result] = await connection.query(
      "UPDATE categories SET limit_amount = ? WHERE user_id = ? AND id = ?",
      [limit_amount, user_id, category_id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    const [updateBudget] = await connection.query(
      "SELECT * FROM categories WHERE id = ?",
      [category_id]
    );

    await connection.commit();
    return {
      ...updateBudget[0],
      limit_amount: Number(updateBudget[0].limit_amount),
    };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error update budget", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = { budgetList, editLimitAmount };
