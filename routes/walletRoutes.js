const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const router = express.Router();
const {
  showWallet,
  addingWallet,
  UpdateWallet,
  WalletDetail,
  DeleteWallet,
} = require("../controllers/walletController");

router.use(verifyToken);
router.get("/all/:user_id/", showWallet);
router.post("/:user_id", addingWallet);
router.get("/:wallet_id", WalletDetail);
router.put("/:wallet_id", UpdateWallet);
router.delete("/:wallet_id", DeleteWallet);

module.exports = router;
