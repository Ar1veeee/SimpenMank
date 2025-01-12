const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const verifyUser = require("../middlewares/transactionMiddlewares");
const router = express.Router();
const {
  Transactions,
  TransactionDetail,
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

router.delete("/:transaction_id",verifyUser, deleteTransaction);
router.get("/:transaction_id/details", verifyUser, TransactionDetail);

router.put("/:transaction_id/income",verifyUser, UpdateIncome);
router.put("/:transaction_id/expense",verifyUser, UpdateExpense);

module.exports = router;
