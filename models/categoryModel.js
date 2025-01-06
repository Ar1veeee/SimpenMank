const db = require("../config/db");

const addCategory = async (user_id, name, type) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)",
      [user_id, name, type]
    );

    const [newCategory] = await connection.query(
      "SELECT * FROM categories WHERE id = ?",
      [result.insertId]
    );

    await connection.commit();
    return newCategory[0];
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error adding category:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const getUserCategory = async (user_id, type) => {
  const [rows] = await db.query(
    "SELECT * FROM categories WHERE user_id = ? AND type = ? ",
    [user_id, type]
  );
  return rows;
};
const getDefaultCategory = async (type) => {
  const [rows] = await db.query(
    "SELECT * FROM categories WHERE type = ? AND user_id IS NULL",
    [type]
  );
  return rows;
};

const addIncomeCategory = async (user_id, name) => {
  return await addCategory(user_id, name, "income");
};

const addExpenseCategory = async (user_id, name) => {
  return await addCategory(user_id, name, "expense");
};

const getCategoryIdByName = async (category_name) => {
  const [rows] = await db.query("SELECT id FROM categories WHERE name = ?", [
    category_name,
  ]);
  return rows.length > 0 ? rows[0].id : null;
};

module.exports = {
  getUserCategory,
  getDefaultCategory,
  addIncomeCategory,
  addExpenseCategory,
  getCategoryIdByName,
};
