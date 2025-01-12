const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddlewares");
const {
    verifyProfileOwnership,
  } = require("../middlewares/userMiddlewares");
const { updatePassword, Profile } = require("../controllers/profileController");

const verifyUser = verifyProfileOwnership;

router.use(verifyToken);
router.use(verifyUser);
router.get("/", Profile);
router.patch("/password", updatePassword);

module.exports = router;
