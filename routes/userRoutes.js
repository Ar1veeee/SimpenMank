const express = require("express");
const router = express.Router();
const {
  googleLogin,
  googleCallback,
} = require("../controllers/googleController");
const { register, login } = require("../controllers/usersController");
const { firebaseAuth } = require("../controllers/firebaseController");

router.get("/google", googleLogin);
router.post("/firebase", firebaseAuth);
router.get("/google/callback", googleCallback);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
