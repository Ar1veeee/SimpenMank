const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const router = express.Router();
const {
  getWeeklyBudget,
  getMonthlyBudget,
  getAnnuallyBudget,
  addLimitAmount
} = require("../controllers/budgetController");

router.get("/:user_id/weekly", getWeeklyBudget);
router.get("/:user_id/monthly", getMonthlyBudget);
router.get("/:user_id/annually", getAnnuallyBudget);
router.patch("/:category_id", addLimitAmount);

module.exports = router;
