const admin = require("../config/firebase");
const jwt = require("jsonwebtoken");
const { findOrCreateUser } = require("../models/usersModel");
const { createDefaultWallets } = require("../models/walletModel");
const { createDefaultCategory } = require("../models/categoryModel");

const firebaseAuth = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken.email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const profile = {
      id: decodedToken.uid,
      displayName: decodedToken.name || "Unnamed User",
      emails: [{ value: decodedToken.email }],
    };

    const user = await findOrCreateUser(profile);

    /* eslint-disable no-undef */
    const backendToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    if (user.isNewUser) {
      await createDefaultWallets(user.id);
      await createDefaultCategory(user.id);
    }

    res.json({
      success: true,
      message: "Authentication successful",
      user_id: user.id,
      username: user.username,
      token: backendToken,
      isNewUser: user.isNewUser,
    });
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

module.exports = { firebaseAuth };
