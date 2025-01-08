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
router.post("/:user_id/income", IncomeCategory);
router.post("/:user_id/expense", ExpenseCategory);
router.get("/:user_id/:type", Categories);

router.get("/:category_id", CategoryDetail);
router.patch("/:category_id", UpdateCategory);

module.exports = router;
