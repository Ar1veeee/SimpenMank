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
    "SELECT id, name, type FROM categories WHERE user_id = ? AND type = ? ",
    [user_id, type]
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

const createDefaultCategory = async (user_id) => {
  const defaultCategory = [
    { name: "Salary", type: "income" },
    { name: "Gift", type: "income" },
    { name: "Bonus", type: "income" },
    { name: "Business Income", type: "income" },
    { name: "Interest", type: "income" },
    { name: "Transport", type: "expense" },
    { name: "Food", type: "expense" },
    { name: "Social Life", type: "expense" },
    { name: "Health", type: "expense" },
    { name: "Apparel", type: "expense" },
  ];

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    for (const category of defaultCategory) {
      await connection.query(
        `INSERT INTO categories (user_id, name, type) 
         VALUES (?, ?, ?)`,
        [user_id, category.name, category.type]
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



const getCategoryIdByName = async (category_name) => {
  const [rows] = await db.query("SELECT id FROM categories WHERE name = ?", [
    category_name,
  ]);
  return rows.length > 0 ? rows[0].id : null;
};

module.exports = {
  getUserCategory,
  getCategoryDetail,
  addIncomeCategory,
  addExpenseCategory,
  getCategoryIdByName,
  deleteUserCategory,
  editCategoryName,
  createDefaultCategory,  
};
