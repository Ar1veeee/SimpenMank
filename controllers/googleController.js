const passport = require("passport");
const jwt = require("jsonwebtoken");

// Route untuk menginisialisasi login Google
const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Route callback setelah autentikasi berhasil
const googleCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect("/login");

      // Login sukses, buat token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login successful", token });
    }
  )(req, res, next);
};

module.exports = { googleLogin, googleCallback };
