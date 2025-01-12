const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const {
  verifyWalletOwnership,
} = require("../middlewares/userMiddlewares");
const router = express.Router();
const {
  showWallet,
  addingWallet,
  UpdateWallet,
  WalletDetail,
  DeleteWallet,
} = require("../controllers/walletController");

const verifyUser = verifyWalletOwnership;

router.use(verifyToken);
router.use(verifyUser);
router.get("/", showWallet);
router.post("/", addingWallet);
router.get("/:wallet_id", WalletDetail);
router.patch("/:wallet_id", UpdateWallet);
router.delete("/:wallet_id", DeleteWallet);

module.exports = router;
