const db = require("../config/db");

const getUserGoals = async (user_id) => {
  const [rows] = await db.query("SELECT * FROM goals WHERE user_id = ?", [
    user_id,
  ]);
  return rows.map((row) => ({
    ...row,
    target_amount: Number(row.target_amount),
    current_amount: Number(row.current_amount),
    deadline: row.deadline
      ? new Date(row.deadline).toLocaleString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null,
    created_at: row.created_at
      ? new Date(row.created_at).toLocaleString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null,
  }));
};

const getGoalDetails = async (user_id, goal_id) => {
  const [rows] = await db.query(
    "SELECT * FROM goals WHERE user_id = ? AND id = ?",
    [user_id, goal_id]
  );
  return rows.map((row) => ({
    ...row,
    target_amount: Number(row.target_amount),
    current_amount: Number(row.current_amount),
    deadline: row.deadline
      ? new Date(row.deadline).toLocaleString("id-ID", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })
      : null,
    created_at: row.created_at
      ? new Date(row.created_at).toLocaleString("id-ID", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })
      : null,
  }));
};

const addUserGoal = async (
  user_id,
  goal_name,
  target_amount,
  current_amount,
  deadline
) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    let goal_status = "in_progress";
    if (current_amount >= target_amount) {
      goal_status = "completed";
    } else if (new Date(deadline) < new Date()) {
      goal_status = "expired";
    }

    const [result] = await connection.query(
      "INSERT INTO goals (user_id, name, target_amount, current_amount, deadline, status) VALUES (?,?,?,?,?,?)",
      [user_id, goal_name, target_amount, current_amount, deadline, goal_status]
    );

    const goal_id = result.insertId;

    if (current_amount >= target_amount) {
      await connection.query(
        "UPDATE goals SET status = 'completed' WHERE id = ?",
        [goal_id]
      );
    } else if (new Date(deadline) < new Date()) {
      await connection.query(
        "UPDATE goals SET status = 'expired' WHERE id = ?",
        [goal_id]
      );
    }

    const [newGoal] = await connection.query(
      "SELECT * FROM goals WHERE id = ?",
      [goal_id]
    );

    await connection.commit();
    return newGoal[0];
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error adding goal:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const editUserGoal = async (
  user_id,
  goal_id,
  goal_name,
  target_amount,
  current_amount,
  deadline,  
) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    let goal_status = "in_progress";
    if (current_amount >= target_amount) {
      goal_status = "completed";
    } else if (new Date(deadline) < new Date()) {
      goal_status = "expired";
    }

    const [result] = await connection.query(
      "UPDATE goals SET name = ?, target_amount = ?, current_amount = ?, deadline = ?, status = ? WHERE user_id = ? AND id = ?",
      [
        goal_name,
        target_amount,
        current_amount,
        deadline,
        goal_status,
        user_id,
        goal_id,
      ]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    if (current_amount >= target_amount) {
      await connection.query(
        "UPDATE goals SET status = 'completed' WHERE id = ?",
        [goal_id]
      );
    } else if (new Date(deadline) < new Date()) {
      await connection.query(
        "UPDATE goals SET status = 'expired' WHERE id = ?",
        [goal_id]
      );
    }

    const [updateGoal] = await connection.query(
      "SELECT * FROM goals WHERE id = ?",
      [goal_id]
    );

    await connection.commit();
    return updateGoal[0];
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error update goal:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const deleteUserGoal = async (user_id, goal_id) => {
  const [result] = await db.query(
    "DELETE FROM goals WHERE user_id = ? AND id = ?",
    [user_id, goal_id]
  );
  return result.affectedRows > 0;
};
module.exports = {
  getUserGoals,
  getGoalDetails,
  addUserGoal,
  editUserGoal,
  deleteUserGoal,
};
