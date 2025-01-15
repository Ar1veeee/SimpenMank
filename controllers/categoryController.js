const {
  getUserCategory,
  getCategoryDetail,
  addIncomeCategory,
  addExpenseCategory,
  editCategoryName,
  deleteUserCategory,
} = require("../models/categoryModel");
const { findUserById } = require("../models/usersModel");

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

const validateUser = async (res, user_id) => {
  const user = await findUserById(user_id);
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return null;
  }
  return user;
};

const Categories = async (req, res) => {
  const { type } = req.params;
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!type) {
    return res.status(404).json({ message: "Type Is Required" });
  }

  try {
    const userCategories = await getUserCategory(user_id, type);
    res.status(200).json({ userCategories });
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Categories:");
  }
};

const CategoryDetail = async (req, res) => {
  const { category_id } = req.params;
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!category_id) {
    return res.status(404).json({ message: "Category ID Is Required" });
  }

  try {
    const result = await getCategoryDetail(user_id, category_id);
    if (!result) {
      return res.status(404).json({ message: "Category Not Found" });
    }
    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Category Detail:");
  }
};

const IncomeCategory = async (req, res) => {
  const user_id = req.user.id;
  const { category_name } = req.body;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!validateRequestBody(res, category_name, "Category Name")) return;

  try {
    await addIncomeCategory(user_id, category_name);
    res.status(201).json({ message: "Income category successfully added" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Adding Income Category:");
  }
};

const ExpenseCategory = async (req, res) => {
  const user_id = req.user.id;
  const { category_name } = req.body;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!validateRequestBody(res, category_name, "Category Name")) return;

  try {
    await addExpenseCategory(user_id, category_name);
    res.status(201).json({ message: "Expense category successfully added" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Adding Expense Category:");
  }
};

const UpdateCategory = async (req, res) => {
  const { category_id } = req.params;
  const user_id = req.user.id;
  const { category_name } = req.body;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!category_id) {
    return res
      .status(400)
      .json({ message: "User ID & Category ID is required" });
  }
  if (!validateRequestBody(res, category_name, "Category Name")) return;

  try {
    await editCategoryName(user_id, category_id, category_name);
    res.status(200).json({ message: "Category successfully updated" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Updating Category:");
  }
};

const DeleteCategory = async (req, res) => {
  const { category_id } = req.params;
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!category_id) {
    return res.status(400).json({ message: "Category ID is required" });
  }

  try {
    const result = await deleteUserCategory(user_id, category_id);
    if (!result) {
      return res.status(400).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category successfully deleted" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Deleting Category");
  }
};

module.exports = {
  Categories,
  IncomeCategory,
  ExpenseCategory,
  CategoryDetail,
  UpdateCategory,
  DeleteCategory,
};
