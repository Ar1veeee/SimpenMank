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
const { cacheMiddleware } = require("../middlewares/redisMiddlewares");


const verifyUser = verifyWalletOwnership;

router.use(verifyToken);
router.use(verifyUser);
router.get("/", cacheMiddleware("showWallet"), showWallet);
router.post("/", addingWallet);

router.patch("/:wallet_id", UpdateWallet);
router.delete("/:wallet_id", DeleteWallet);

router.get("/:wallet_id/detail", WalletDetail);

module.exports = router;
