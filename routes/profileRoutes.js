const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddlewares");
const { updatePassword, Profile } = require("../controllers/profileController");

router.use(verifyToken);
router.get("/:user_id", Profile);
router.patch("/:user_id/password", updatePassword);

module.exports = router;
