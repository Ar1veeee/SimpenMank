const {
  getUserWallet,
  getWalletDetail,
  updateUserWallet,
  addWallet,
  deleteUserWallet,
} = require("../models/walletModel");
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

const showWallet = async (req, res) => {
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;

  try {
    const wallets = await getUserWallet(user_id);
    res.status(200).json({ wallets });
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Wallets:");
  }
};

const WalletDetail = async (req, res) => {
  const { wallet_id } = req.params;
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!wallet_id) {
    return res.status(400).json({ message: "Wallet ID is required" });
  }

  try {
    const result = await getWalletDetail(user_id, wallet_id);
    if (result && result.balance) {
      result.balance = Number(result.balance);
    }
    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Wallet Detail:");
  }
};

const addingWallet = async (req, res) => {
  const user_id = req.user.id;
  const { wallet_name } = req.body;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!wallet_name) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    await addWallet(user_id, wallet_name);
    res.status(201).json({ message: "Wallet successfully added" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Adding Wallet:");
  }
};

const UpdateWallet = async (req, res) => {
  const { wallet_id } = req.params;
  const user_id = req.user.id;
  const { wallet_name } = req.body;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!wallet_id) {
    return res.status(400).json({ message: "Wallet ID is required" });
  }

  if (!wallet_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await updateUserWallet(user_id, wallet_id, wallet_name);
    res.status(200).json({ message: "Wallet update successfully" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Updating Wallet:");
  }
};

const DeleteWallet = async (req, res) => {
  const { wallet_id } = req.params;
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!wallet_id) {
    return res.status(400).json({ message: "Wallet ID is required" });
  }


  try {
    const result = await deleteUserWallet(user_id, wallet_id);
    if (!result) {
      return res.status(400).json({ message: "Wallet not found" });
    }
    res.status(200).json({ message: "Wallet has been successfully deleted" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Deleting Wallet:");
  }
};

module.exports = {
  showWallet,
  addingWallet,
  UpdateWallet,
  WalletDetail,
  DeleteWallet,
};
