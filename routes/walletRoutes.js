const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const router = express.Router();
const { showWallet, addingWallet, UpdateWallet, WalletDetail } = require("../controllers/walletController");

router.use(verifyToken);
router.get("/:user_id", showWallet);
router.post("/:user_id", addingWallet);
router.put("/:user_id/:wallet_id", UpdateWallet);
router.get("/:user_id/:wallet_id", WalletDetail);

module.exports = router;
