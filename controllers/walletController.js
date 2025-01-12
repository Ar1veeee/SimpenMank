const {
  getUserWallet,
  getWalletDetail,
  updateUserWallet,
  addWallet,
  deleteUserWallet,
} = require("../models/walletModel");
const { findUserById } = require("../models/usersModel");

const showWallet = async (req, res) => {
  const user_id = req.user.id;
  if (!user_id) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const wallets = await getUserWallet(user_id);
    res.status(200).json({wallets});
  } catch (error) {
    console.error("Error fetching wallets:", error);
    res.status(500).json({
      message: "Error fetching wallets",
    });
  }
};

const WalletDetail = async (req, res) => {
  const { wallet_id } = req.params;
  const user_id = req.user.id;

  if (!wallet_id) {
    return res.status(400).json({ message: "Wallet ID is required" });
  }
  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const result = await getWalletDetail(user_id, wallet_id);
    if (result && result.balance) {
      result.balance = Number(result.balance);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching wallet detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addingWallet = async (req, res) => {
  const user_id = req.user.id;
  const { wallet_name } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  if (!wallet_name) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const user = await findUserById(user_id);

    if (!user) {
      return res.status(404).json({
        message: "User ID not found",
      });
    }

    await addWallet(user_id, wallet_name);
    res.status(201).json({ message: "Wallet successfully added" });
  } catch (error) {
    console.error("Error adding wallet:", error);
    res.status(500).json({
      message: "Error adding wallet",
    });
  }
};

const UpdateWallet = async (req, res) => {
  const { wallet_id } = req.params;
  const user_id = req.user.id;

  const { wallet_name } = req.body;

  if (!wallet_id) {
    return res.status(400).json({ message: "Wallet ID is required" });
  }

  if (!wallet_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    await updateUserWallet(user_id, wallet_id, wallet_name);
    res.status(200).json({ message: "Wallet update successfully" });
  } catch (error) {
    console.error("Error update wallet", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteWallet = async (req, res) => {
  const { wallet_id } = req.params;
  const user_id = req.user.id;
  if (!wallet_id) {
    return res.status(400).json({ message: "Wallet ID is required" });
  }
  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const result = await deleteUserWallet(user_id, wallet_id);
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
