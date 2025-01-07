const {
  getUserTransactions,
  getTransactionDetails,
  updateUserTransactions,
  addTransaction,
  deleteUserTransaction,
} = require("../models/transactionModel");
const { getCategoryIdByName } = require("../models/categoryModel");
const { getWalletIdByName } = require("../models/walletModel");
const { findUserById } = require("../models/usersModel");

const Transactions = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User ID not found" });
    }
    const transactions = await getUserTransactions(user_id);
    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const UpdateTransaction = async (req, res, type) => {
  const { user_id, transaction_id } = req.params;
  const { wallet_name, category_name, transaction_date, amount, description } =
    req.body;

  if (!user_id || !transaction_id) {
    return res.status(400).json({ message: "User ID & Transaction ID is required" });
  }

  if (!transaction_date || !amount || !category_name || !wallet_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [user, wallet_id, category_id] = await Promise.all([
      findUserById(user_id),
      getWalletIdByName(wallet_name),
      getCategoryIdByName(category_name),
    ]);
    if (!user) {
      return res.status(404).json({ message: "User ID not found" });
    }

    if (!wallet_id) {
      return res.status(400).json({ message: "Wallet not found in database" });
    }

    if (!category_id) {
      return res
        .status(400)
        .json({ message: "Category not found in database" });
    }

    await updateUserTransactions(  
      user_id,
      transaction_id,    
      wallet_id,
      category_id,
      amount,
      description,
      transaction_date,
      type,
    );
    res.status(200).json({message: "Transaction update successfully"});
  } catch (error) {
    console.error(`Error update ${type} transaction:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const UpdateIncome = (req, res) => UpdateTransaction(req, res, "income");
const UpdateExpense = (req, res) => UpdateTransaction(req, res, "expense");

const TransactionDetails = async (req, res) => {
  const { user_id, transaction_id } = req.params;
  if (!user_id || !transaction_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User ID not found" });
    }
    const transactionDetail = await getTransactionDetails(
      user_id,
      transaction_id
    );
    res.status(200).json({ transactionDetail });
  } catch (error) {
    console.error("Error fetching transaction detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleTransaction = async (req, res, type) => {
  const { user_id } = req.params;
  const { wallet_name, category_name, transaction_date, amount, description } =
    req.body;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!transaction_date || !amount || !category_name || !wallet_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [user, wallet_id, category_id] = await Promise.all([
      findUserById(user_id),
      getWalletIdByName(wallet_name),
      getCategoryIdByName(category_name),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User ID not found" });
    }

    if (!wallet_id) {
      return res.status(400).json({ message: "Wallet not found in database" });
    }

    if (!category_id) {
      return res
        .status(400)
        .json({ message: "Category not found in database" });
    }

    await addTransaction(
      user_id,
      wallet_id,
      category_id,
      amount,
      description,
      transaction_date,
      type
    );

    res.status(201).json({ message: "Transaction added successfully" });
  } catch (error) {
    console.error(`Error adding ${type} transaction:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const IncomeTransaction = (req, res) => handleTransaction(req, res, "income");

const ExpenseTransaction = (req, res) => handleTransaction(req, res, "expense");

const deleteTransaction = async (req, res) => {
  const { user_id, transaction_id } = req.params;
  if (!user_id || !transaction_id) {
    return res
      .status(400)
      .json({ message: "User ID & Transaction ID is required" });
  }

  try {
    const result = await deleteUserTransaction(user_id, transaction_id);

    if (!result) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res
      .status(200)
      .json({ message: "Transaction has been successfully deleted" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  Transactions,
  TransactionDetails,
  IncomeTransaction,
  ExpenseTransaction,
  UpdateIncome,
  UpdateExpense,
  deleteTransaction,
};