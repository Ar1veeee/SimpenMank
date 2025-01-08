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

const getCategoryDetail = async (category_id) => {
  const [rows] = await db.query("SELECT name FROM categories WHERE id = ?", [
    category_id,
  ]);
  return rows;
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

const editCategoryName = async (category_id, name) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [result] = await connection.query(
      "UPDATE categories SET name = ? WHERE  id = ?",
      [name, category_id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    const [updateName] = await connection.query(
      "SELECT * FROM categories WHERE id = ?",
      [category_id]
    );
    await connection.commit();
    return updateName[0];
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error update name category:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const deleteUserCategory = async (category_id) => {
  const [result] = await db.query("DELETE FROM categories WHERE id = ?", [
    category_id,
  ]);
  return result.affectedRows > 0;
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
  getCategoryDetail,
  addIncomeCategory,
  addExpenseCategory,
  getCategoryIdByName,
  deleteUserCategory,
  editCategoryName,
};
