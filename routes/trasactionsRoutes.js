const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const router = express.Router();
const {
  Transactions,
  TransactionDetails,
  IncomeTransaction,
  ExpenseTransaction,
  UpdateIncome,
  UpdateExpense,
  deleteTransaction,
  MonthlyReports,
} = require("../controllers/transactionController");

router.use(verifyToken);
router.get("/:user_id", Transactions);
router.post("/:user_id/income", IncomeTransaction);
router.post("/:user_id/expense", ExpenseTransaction);
router.get("/:user_id/monthly", MonthlyReports);
router.put("/:user_id/:transaction_id/income", UpdateIncome);
router.put("/:user_id/:transaction_id/expense", UpdateExpense);
router.delete("/:user_id/:transaction_id", deleteTransaction);
router.get("/:user_id/:transaction_id", TransactionDetails);

module.exports = router;
