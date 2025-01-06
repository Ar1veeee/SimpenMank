const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const router = express.Router();
const { showWallet, addingWallet } = require("../controllers/walletController");

router.use(verifyToken);
router.get("/:user_id", showWallet);
router.post("/:user_id", addingWallet);

module.exports = router;
