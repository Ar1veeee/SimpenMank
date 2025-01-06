const {
  getUserCategory,
  getDefaultCategory,
  addIncomeCategory,
  addExpenseCategory,
} = require("../models/categoryModel");

const handleErrorResponse = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({ message });
};

const validateRequestBody = (res, field, fieldName) => {
  if (!field) {
    res.status(400).json({ message: `${fieldName} Must Be Filled In` });
    return false;
  }
  return true;
};

const Categories = async (req, res) => {
  const { user_id, type } = req.params;
  if (!user_id || !type) {
    return res.status(404).json({ message: "User ID and Type Is Required" });
  }
  try {
    const userCategories = await getUserCategory(user_id, type);
    const defaultCategories = await getDefaultCategory(type);
    const categories = [...userCategories, ...defaultCategories];
    res.status(200).json({ categories });
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Category:");
  }
};

const IncomeCategory = async (req, res) => {
  const { user_id } = req.params;
  const { name } = req.body;
  if (!validateRequestBody(res, name, "Category Name")) return;
  try {
    await addIncomeCategory(user_id, name);
    res.status(201).json({ message: "Income category added successfully" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Adding Income Category:");
  }
};

const ExpenseCategory = async (req, res) => {
  const { user_id } = req.params;
  const { name } = req.body;

  if (!validateRequestBody(res, name, "Category Name")) return;

  try {
    await addExpenseCategory(user_id, name);
    res.status(201).json({ message: "Expense category added successfully" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Adding Expense Category:");
  }
};

module.exports = { Categories, IncomeCategory, ExpenseCategory };
