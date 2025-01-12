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

const Categories = async (req, res) => {
  const { type } = req.params;
  const user_id = req.user.id;

  if (!user_id || !type) {
    return res.status(404).json({ message: "User ID and Type Is Required" });
  }
  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const userCategories = await getUserCategory(user_id, type);
    res.status(200).json({ userCategories });
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Category:");
  }
};

const CategoryDetail = async (req, res) => {
  const { category_id } = req.params;
  const user_id = req.user.id;

  if (!category_id) {
    return res.status(404).json({ message: "Category ID Is Required" });
  }

  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const result = await getCategoryDetail(user_id, category_id);
    if (!result) {
      return res.status(404).json({ message: "Category Not Found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching category detail:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const IncomeCategory = async (req, res) => {
  const user_id = req.user.id;
  const { name } = req.body;
  if (!validateRequestBody(res, name, "Category Name")) return;
  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    await addIncomeCategory(user_id, name);
    res.status(201).json({ message: "Income category successfully added" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Adding Income Category:");
  }
};

const ExpenseCategory = async (req, res) => {
  const user_id = req.user.id;
  const { name } = req.body;

  if (!validateRequestBody(res, name, "Category Name")) return;

  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    await addExpenseCategory(user_id, name);
    res.status(201).json({ message: "Expense category successfully added" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Adding Expense Category:");
  }
};

const UpdateCategory = async (req, res) => {
  const { category_id } = req.params;
  const user_id = req.user.id;
  const { category_name } = req.body;

  if (!category_id) {
    return res
      .status(400)
      .json({ message: "User ID & Category ID is required" });
  }

  if (!category_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    await editCategoryName(user_id, category_id, category_name);
    res.status(200).json({ message: "Category successfully updated" });
  } catch (error) {
    console.error("Error update category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteCategory = async (req, res) => {
  const { category_id } = req.params;
  const user_id = req.user.id;
  if (!category_id) {
    return res.status(400).json({ message: "Category ID is required" });
  }
  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const result = await deleteUserCategory(user_id, category_id);
    if (!result) {
      return res.status(400).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category successfully deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal Server Error" });
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
