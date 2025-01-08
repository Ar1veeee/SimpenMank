const { budgetList, editLimitAmount } = require("../models/budgetModels");

const getBudgetByPeriod = async (req, res, period) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
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
  try {
    await editLimitAmount(category_id, limit_amount);
    res.status(200).json({ message: "Limit Amount successfully added" });
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
