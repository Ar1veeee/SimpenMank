const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const router = express.Router();
const {
  Categories,
  IncomeCategory,
  ExpenseCategory,
} = require("../controllers/categoryController");

router.use(verifyToken);
router.get("/:user_id/:type", Categories);
router.post("/:user_id/income", IncomeCategory);
router.post("/:user_id/expense", ExpenseCategory);

module.exports = router;
