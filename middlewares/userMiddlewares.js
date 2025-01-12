const db = require("../config/db");

const verifyTransactionOwnership = async (req, res, next) => {
  const { transaction_id } = req.params;
  const user_id = req.user.id;

  try {
    const [transaction] = await db.query(
      "SELECT * FROM transactions WHERE id = ? AND user_id = ?",
      [transaction_id, user_id]
    );

    if (!transaction) {
      return res
        .status(404)
        .json({ error: "Transaction not found or not authorized to access" });
    }

    next();
  } catch (error) {
    console.error("Error checking transaction ownership:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const verifyGoalOwnership = async (req, res, next) => {
  const { goal_id } = req.params;
  const user_id = req.user.id;

  try {
    const [goal] = await db.query(
      "SELECT * FROM goals WHERE id = ? AND user_id = ?",
      [goal_id, user_id]
    );

    if (!goal) {
      return res
        .status(404)
        .json({ error: "Goal not found or not authorized to access" });
    }

    next();
  } catch (error) {
    console.error("Error checking goal ownership:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const verifyCategoryOwnership = async (req, res, next) => {
  const { category_id } = req.params;
  const user_id = req.user.id;

  try {
    const [category] = await db.query(
      "SELECT * FROM categories WHERE id = ? AND user_id = ?",
      [category_id, user_id]
    );

    if (!category) {
      return res
        .status(404)
        .json({ error: "Category not found or not authorized to access" });
    }

    next();
  } catch (error) {
    console.error("Error checking category ownership:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  verifyTransactionOwnership,
  verifyGoalOwnership,
  verifyCategoryOwnership,
};
