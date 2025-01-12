const { budgetList, editLimitAmount } = require("../models/budgetModels");
const { findUserById } = require("../models/usersModel");

const getBudgetByPeriod = async (req, res, period) => {
  const user_id = req.user.id;
  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await findUserById(user_id);

    if (!user) {
      return res.status(404).json({
        message: "User ID not found",
      });
    }
    const budgets = await budgetList(user_id, period);
    res.status(200).json({ budgets });
  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getWeeklyBudget = (req, res) => getBudgetByPeriod(req, res, "weekly");
const getMonthlyBudget = (req, res) => getBudgetByPeriod(req, res, "monthly");
const getAnnuallyBudget = (req, res) => getBudgetByPeriod(req, res, "annually");

const addLimitAmount = async (req, res) => {
  const { category_id } = req.params;
  const user_id = req.user.id;

  const { limit_amount } = req.body;

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
    return res
      .status(400)
      .json({
        message: "Limit amount must be a valid number and cannot be negative",
      });
  }

  try {
    const user = await findUserById(user_id);

    if (!user) {
      return res.status(404).json({
        message: "User ID not found",
      });
    }
    await editLimitAmount(user_id, category_id, limit_amount);
    res.status(200).json({ message: "Limit Amount successfully set" });
  } catch (error) {
    console.error("Error update limit amount", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getWeeklyBudget,
  getMonthlyBudget,
  getAnnuallyBudget,
  addLimitAmount,
};
