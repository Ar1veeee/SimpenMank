const passport = require("passport");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { findOrCreateUser } = require("../models/usersModel");
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

const googleLoginMobile = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verifikasi token dengan Google API
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );
    const payload = response.data;

    // Validasi audience dari token
    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: "Invalid token audience" });
    }

    // Buat atau cari user berdasarkan payload
    const user = await findOrCreateUser({
      id: payload.sub,
      displayName: payload.name,
      emails: [{ value: payload.email }],
    });

    // Generate JWT untuk user
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    if (user.isNewUser) {
      await createDefaultWallets(user.id);
      await createDefaultCategory(user.id);
    }

    res.json({
      message: "Login successful",
      user: user.username,
      token,
    });
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

module.exports = { googleLogin, googleCallback, googleLoginMobile };