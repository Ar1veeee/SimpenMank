const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const router = express.Router();
const {
  Categories,
  CategoryDetail,
  IncomeCategory,
  ExpenseCategory,
  UpdateCategory,
} = require("../controllers/categoryController");

router.use(verifyToken);
router.get("/:user_id/:category_id", CategoryDetail);
router.patch("/:user_id/:category_id", UpdateCategory);
router.get("/:user_id/:type", Categories);
router.post("/:user_id/income", IncomeCategory);
router.post("/:user_id/expense", ExpenseCategory);

module.exports = router;
