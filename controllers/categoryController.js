const {
  getUserCategory,
  getDefaultCategory,
  getCategoryDetail,
  addIncomeCategory,
  addExpenseCategory,
  editCategoryName,
  deleteUserCategory
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

const CategoryDetail = async (req, res) => {
  const { category_id } = req.params;
  if (!category_id) {
    return res
      .status(404)
      .json({ message: "User ID and Category ID Is Required" });
  }

  try {
    const result = await getCategoryDetail(category_id);
    if (!result) {
      return res.status(404).json({ message: "Category Not Found" });
    }
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching category detail:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

const UpdateCategory = async (req, res) => {
  const { category_id } = req.params;
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
    await editCategoryName(category_id, category_name);
    res.status(200).json({ message: "Category update successfully" });
  } catch (error) {
    console.error("Error update category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteCategory = async (req, res) => {
  const {category_id} =req.params;
  if (category_id) {
    return res
    .status(400)
    .json({message: "Category ID is required"})
  }
  try {
    const result = await deleteUserCategory(category_id);
    if (!result) {
      return res
      .status(400)
      .json({message: "Category not found"})
    }

    res
    .status(200)
    .json({message: "Category has been successfully deleted"})
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  Categories,
  IncomeCategory,
  ExpenseCategory,
  CategoryDetail,
  UpdateCategory,
  DeleteCategory
};
