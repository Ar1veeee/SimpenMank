const passport = require("passport");
const jwt = require("jsonwebtoken");
const { createDefaultWallets } = require("../models/walletModel");
const { createDefaultCategory } = require("../models/categoryModel");

const handleErrorResponse = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({ message });
};

const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

/* eslint-disable no-undef */
const googleCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    async (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect("/login");

      try {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        if (user.isNewUser) {
          await createDefaultWallets(user.id);
          await createDefaultCategory(user.id);
        }

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 3600000,
        });

        res.json({
          message: "Login successful",
          user_id: user.id,
          username: user.username,
          token,
        });
      } catch (error) {
        handleErrorResponse(res, error, "Error during user initialization:");
      }
    }
  )(req, res, next);
};

module.exports = { googleLogin, googleCallback };
