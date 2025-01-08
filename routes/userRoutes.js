const express = require("express");
const router = express.Router();
const {
  googleLogin,
  googleCallback,
} = require("../controllers/googleController");
const { register, login } = require("../controllers/usersController");

router.get("/google", googleLogin);
router.get("/google/mobile", googleLogin);
router.get("/google/callback", googleCallback);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
