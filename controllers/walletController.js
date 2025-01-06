const {
  getUserWallet,
  getDefaultWallet,
  addWallet,
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
    const wallets = await Promise.all([
      getUserWallet(user_id),
      getDefaultWallet(),
    ]);

    if (!user) {
      return res.status(404).json({
        message: "User ID not found",
      });
    }

    res.status(200).json({ wallets });
  } catch (error) {
    console.error("Error fetching wallets:", error);
    res.status(500).json({
      message: "Error fetching wallets",
    });
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

module.exports = { showWallet, addingWallet };
