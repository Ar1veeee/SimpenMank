const { findUserById, updateUserPassword } = require("../models/usersModel");

const validatePassword = (password) => {
  if (!password) {
    return "New Password Must Be Filled In";
  }

  const validations = [
    { regex: /^(?=.*[A-Z]).{7,}$/, message: "Password must be at least 8 characters and include an uppercase letter." },
    { regex: /^(?=.*\d)/, message: "Password must contain at least one number." },
    { regex: /^(?=.*[!@#$%^&*(),.?":{}|<>])/, message: "Password must contain at least one special character." },
  ];

  for (const { regex, message } of validations) {
    if (!regex.test(password)) {
      return message;
    }
  }

  return null;
};

const updatePassword = async (req, res) => {
  const { user_id } = req.params;
  const { newPassword } = req.body;

  const validationError = validatePassword(newPassword);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User ID Not Found" });
    }

    await updateUserPassword(user_id, newPassword);
    res.status(200).json({ message: "Update Password Successfully" });
  } catch (error) {
    console.error("Error Fetching Update Password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const Profile = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User ID Not Found" });
    }

    res.status(200).json({
      Profile: {
        UserID: user.id,
        Username: user.username,
        Email: user.email,
        Method: user.auth_method,
      },
    });
  } catch (error) {
    console.error("Error Fetching Profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { updatePassword, Profile };
