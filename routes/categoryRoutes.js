const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const {
  verifyCategoryOwnership,
} = require("../middlewares/userMiddlewares");
const router = express.Router();
const {
  Categories,
  CategoryDetail,
  IncomeCategory,
  ExpenseCategory,
  UpdateCategory,
  DeleteCategory,
} = require("../controllers/categoryController");

const verifyUser = verifyCategoryOwnership;

router.use(verifyToken);
router.use(verifyUser);
router.post("/income", IncomeCategory);
router.post("/expense", ExpenseCategory);
router.get("/:type", Categories);
router.patch("/:category_id", UpdateCategory);
router.delete("/:category_id", DeleteCategory);
router.get("/:category_id/details", CategoryDetail);

module.exports = router;
