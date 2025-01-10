const {
  getUserWallet,
  getWalletDetail,
  updateUserWallet,
  addWallet,
  deleteUserWallet,
} = require("../models/walletModel");
const { findUserById } = require("../models/usersModel");

const showWallet = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User ID not found",
      });
    }

    const wallets = await getUserWallet(user_id);
    res.status(200).json({ wallets });
  } catch (error) {
    console.error("Error fetching wallets:", error);
    res.status(500).json({
      message: "Error fetching wallets",
    });
  }
};

const WalletDetail = async (req, res) => {
  const { wallet_id } = req.params;

  if (!wallet_id) {
    return res.status(400).json({ message: "Wallet ID is required" });
  }
  try {
    const result = await getWalletDetail(wallet_id);
    if (result && result.balance) {
      result.balance = Number(result.balance);
    }

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching wallet detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addingWallet = async (req, res) => {
  const { user_id } = req.params;
  const { name, balance } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  if (!name || balance === undefined) {
    return res.status(400).json({
      message: "Wallet name and balance are required",
    });
  }

  try {
    const user = await findUserById(user_id);

    if (!user) {
      return res.status(404).json({
        message: "User ID not found",
      });
    }

    await addWallet(user_id, name, balance);
    res.status(201).json({ message: "Wallet added successfully" });
  } catch (error) {
    console.error("Error adding wallet:", error);
    res.status(500).json({
      message: "Error adding wallet",
    });
  }
};

const UpdateWallet = async (req, res) => {
  const { wallet_id } = req.params;
  const { wallet_name, balance } = req.body;
  
  if (!wallet_id) {
    return res.status(400).json({ message: "Wallet ID is required" });
  }

  if (!wallet_name || !balance) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (isNaN(balance) || balance < 0) {
    return res.status(400).json({ message: "Balance must be a valid number and cannot be negative" });
  }

  try {
    await updateUserWallet(wallet_id, wallet_name, balance);
    res.status(200).json({ message: "Wallet update successfully" });
  } catch (error) {
    console.error("Error update wallet", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteWallet = async (req, res) => {
  const { wallet_id } = req.params;
  if (!wallet_id) {
    return res.status(400).json({ message: "Wallet ID is required" });
  }
  try {
    const result = await deleteUserWallet(wallet_id);
    if (!result) {
      return res.status(400).json({ message: "Wallet not found" });
    }

    res.status(200).json({ message: "Wallet has been successfully deleted" });
  } catch (error) {
    console.error("Error deleting Wallet:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  showWallet,
  addingWallet,
  UpdateWallet,
  WalletDetail,
  DeleteWallet,
};
