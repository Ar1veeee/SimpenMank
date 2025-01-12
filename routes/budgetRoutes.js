const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const router = express.Router();
const {
  verifyCategoryOwnership,
} = require("../middlewares/userMiddlewares");
const {
  getWeeklyBudget,
  getMonthlyBudget,
  getAnnuallyBudget,
  addLimitAmount
} = require("../controllers/budgetController");

const verifyUser = verifyCategoryOwnership;


router.use(verifyToken);
router.use(verifyUser);
router.get("/weekly", getWeeklyBudget);
router.get("/monthly", getMonthlyBudget);
router.get("/annually", getAnnuallyBudget);
router.patch("/:category_id", addLimitAmount);

module.exports = router;
