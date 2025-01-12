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
        return res.status(404).json({ error: "Transaction not found or not authorized to access" });
      }
        
      next();
    } catch (error) {
      console.error("Error checking transaction ownership:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

module.exports = verifyTransactionOwnership;
