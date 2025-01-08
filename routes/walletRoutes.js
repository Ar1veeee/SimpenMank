const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const router = express.Router();
const { showWallet, addingWallet, UpdateWallet, WalletDetail } = require("../controllers/walletController");

router.use(verifyToken);
router.get("/all/:user_id/", showWallet);
router.post("/:user_id", addingWallet);
router.get("/:wallet_id", WalletDetail);
router.put("/:wallet_id", UpdateWallet);

module.exports = router;
