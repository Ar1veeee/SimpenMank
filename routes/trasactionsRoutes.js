const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const router = express.Router();
const {
  Transactions,
  IncomeTransaction,
  ExpenseTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

router.use(verifyToken);
router.get("/:user_id", Transactions);
router.post("/:user_id/income", IncomeTransaction);
router.post("/:user_id/expense", ExpenseTransaction);
router.delete("/:user_id/:transaction_id", deleteTransaction);

module.exports = router;
