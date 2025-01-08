const passport = require("passport");
const jwt = require("jsonwebtoken");
const { createDefaultWallets } = require("../models/walletModel");
const { createDefaultCategory } = require("../models/categoryModel");

const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    async (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect("/login");

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      if (user.isNewUser) {  
        await createDefaultWallets(user.id);
        await createDefaultCategory(user.id);
      }

      res.json({ message: "Login successful",UserID: user.id, user: user.username, token });
    }
  )(req, res, next);
};

module.exports = { googleLogin, googleCallback };
