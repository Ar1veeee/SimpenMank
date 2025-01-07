const passport = require("passport");
const jwt = require("jsonwebtoken");

const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect("/login");

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login successful",UserID: user.id, user: user.username, token });
    }
  )(req, res, next);
};

module.exports = { googleLogin, googleCallback };
