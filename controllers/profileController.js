const { findUserById, updateUserPassword } = require("../models/usersModel");

const validatePassword = (password) => {
  if (!password) {
    return "New Password Must Be Filled In";
  }

  if (!/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}/.test(password)) {
    return "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.";
  }

  return null;
};

const updatePassword = async (req, res) => {
  const user_id = req.user.id;
  const { newPassword } = req.body;

  const validationError = validatePassword(newPassword);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    await updateUserPassword(user_id, newPassword);
    res.status(200).json({ message: "Password successfully updated" });
  } catch (error) {
    console.error("Error Fetching Update Password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const Profile = async (req, res) => {
  const user_id = req.user.id;

  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({      
        user_id: user.id,
        username: user.username,
        email: user.email,
        auth_method: user.auth_method,      
    });
  } catch (error) {
    console.error("Error Fetching Profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { updatePassword, Profile };
