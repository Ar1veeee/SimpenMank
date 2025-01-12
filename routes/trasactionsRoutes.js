const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const {
  verifyTransactionOwnership,
} = require("../middlewares/userMiddlewares");
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

const verifyUser = verifyTransactionOwnership;

router.use(verifyToken);
router.use(verifyUser);
router.get("/", Transactions);
router.post("/income", IncomeTransaction);
router.post("/expense", ExpenseTransaction);
router.get("/monthly", MonthlyReports);

router.delete("/:transaction_id", deleteTransaction);

router.get("/:transaction_id/details", TransactionDetail);
router.put("/:transaction_id/income", UpdateIncome);
router.put("/:transaction_id/expense", UpdateExpense);

module.exports = router;
