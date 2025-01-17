const { budgetList, editLimitAmount } = require("../models/budgetModels");
const { findUserById } = require("../models/usersModel");

const handleErrorResponse = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({ message });
};

const validateUser = async (res, user_id) => {
  const user = await findUserById(user_id);
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return null;
  }
  return user;
};

const getBudgetByPeriod = async (req, res, period) => {
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;

  try {
    const budgets = await budgetList(user_id, period);
    res.status(200).json(budgets);
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Budgets:");
  }
};

const getWeeklyBudget = (req, res) => getBudgetByPeriod(req, res, "weekly");
const getMonthlyBudget = (req, res) => getBudgetByPeriod(req, res, "monthly");
const getAnnuallyBudget = (req, res) => getBudgetByPeriod(req, res, "annually");

const addLimitAmount = async (req, res) => {
  const { category_id } = req.params;
  const user_id = req.user.id;
  const { limit_amount } = req.body;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!category_id) {
    return res.status(400).json({
      message: "Category ID not found",
    });
  }

  if (!limit_amount) {
    return res.status(400).json({
      message: "Missing required field",
    });
  }

  if (isNaN(limit_amount) || limit_amount < 0) {
    return res.status(400).json({
      message: "Limit amount must be a valid number and cannot be negative",
    });
  }

  try {
    await editLimitAmount(user_id, category_id, limit_amount);
    res.status(200).json({ message: "Limit Amount successfully set" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Updating Budget:");
  }
};

module.exports = {
  getWeeklyBudget,
  getMonthlyBudget,
  getAnnuallyBudget,
  addLimitAmount,
};
