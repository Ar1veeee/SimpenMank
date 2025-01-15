const {
  getUserTransactions,
  getTransactionDetail,
  updateUserTransactions,
  addTransaction,
  deleteUserTransaction,
  getMonthlyReport,
} = require("../models/transactionModel");
const { getCategoryIdByName } = require("../models/categoryModel");
const { getWalletIdByName } = require("../models/walletModel");
const { findUserById } = require("../models/usersModel");

const validateTransactionFields = ({
  transaction_date,
  amount,
  wallet_name,
  category_name,
}) => {
  if (!transaction_date) {
    return "Transaction date is required";
  }

  if (!amount || isNaN(amount) || amount < 0) {
    return "Amount must be a valid number and cannot be negative";
  }

  if (
    !wallet_name ||
    typeof wallet_name !== "string" ||
    wallet_name.trim() === ""
  ) {
    return "Wallet name is required and must be a valid string";
  }

  if (
    !category_name ||
    typeof category_name !== "string" ||
    category_name.trim() === ""
  ) {
    return "Category name is required and must be a valid string";
  }

  return null;
};

const validateWalletAndCategory = async (
  wallet_name,
  category_name,
  user_id
) => {
  const [wallet_id, category_id] = await Promise.all([
    getWalletIdByName(wallet_name, user_id),
    getCategoryIdByName(category_name, user_id),
  ]);

  if (!wallet_id) {
    throw new Error("Wallet not found in database");
  }

  if (!category_id) {
    throw new Error("Category not found in database");
  }

  return { wallet_id, category_id };
};

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

const Transactions = async (req, res) => {
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;

  try {
    const transactions = await getUserTransactions(user_id);
    res.status(200).json({ transactions });
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Transactions:");
  }
};

const UpdateTransaction = async (req, res, type) => {
  const { transaction_id } = req.params;
  const user_id = req.user.id;
  const { wallet_name, category_name, transaction_date, amount, description } =
    req.body;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!transaction_id) {
    return res.status(400).json({ message: "Transaction ID is required" });
  }

  const validationError = validateTransactionFields({
    transaction_date,
    amount,
    wallet_name,
    category_name,
  });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const { wallet_id, category_id } = await validateWalletAndCategory(
      wallet_name,
      category_name,
      user_id
    );

    await updateUserTransactions(
      user_id,
      transaction_id,
      wallet_id,
      category_id,
      amount,
      description,
      transaction_date,
      type
    );
    res.status(200).json({ message: "Transaction successfully updated" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Updating Transcation:");
  }
};

const UpdateIncome = (req, res) => UpdateTransaction(req, res, "income");
const UpdateExpense = (req, res) => UpdateTransaction(req, res, "expense");

const TransactionDetail = async (req, res) => {
  const { transaction_id } = req.params;
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!transaction_id) {
    return res.status(400).json({ message: "Transaction ID is required" });
  }

  try {
    const result = await getTransactionDetail(user_id, transaction_id);
    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Transaction Detail:");
  }
};

const handleTransaction = async (req, res, type) => {
  const user_id = req.user.id;
  const { wallet_name, category_name, transaction_date, amount, description } =
    req.body;
  const user = await validateUser(res, user_id);

  if (!user) return;

  const validationError = validateTransactionFields({
    transaction_date,
    amount,
    wallet_name,
    category_name,
  });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const { wallet_id, category_id } = await validateWalletAndCategory(
      wallet_name,
      category_name,
      user_id
    );

    await addTransaction(
      user_id,
      wallet_id,
      category_id,
      amount,
      description,
      transaction_date,
      type
    );

    res.status(201).json({ message: "Transaction successfully added" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Adding Transaction:");
  }
};

const IncomeTransaction = (req, res) => handleTransaction(req, res, "income");

const ExpenseTransaction = (req, res) => handleTransaction(req, res, "expense");

const deleteTransaction = async (req, res) => {
  const { transaction_id } = req.params;
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!transaction_id) {
    return res.status(400).json({ message: "Transaction ID is required" });
  }

  try {
    const result = await deleteUserTransaction(user_id, transaction_id);
    if (!result) {
      return res.status(400).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction successfully deleted" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Deleting Transaction:");
  }
};

const MonthlyReports = async (req, res) => {
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;

  try {
    const monthlyTransaction = await getMonthlyReport(user_id);
    if (monthlyTransaction.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }
    res.status(200).json({ monthlyTransaction });
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Monthly Transactions:");
  }
};

module.exports = {
  Transactions,
  TransactionDetail,
  IncomeTransaction,
  ExpenseTransaction,
  UpdateIncome,
  UpdateExpense,
  deleteTransaction,
  MonthlyReports,
};
