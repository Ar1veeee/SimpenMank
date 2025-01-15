const { findUserById, updateUserPassword } = require("../models/usersModel");

const handleErrorResponse = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({ message });
};

const validateUser = async (res, user_id) => {
  const user = await findUserById(user_id);
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return null;
  }
  return user;
};

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
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    await updateUserPassword(user_id, newPassword);
    res.status(200).json({ message: "Password successfully updated" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Updating Password:");
  }
};

const Profile = async (req, res) => {
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;

  try {
    res.status(200).json({      
        user_id: user.id,
        username: user.username,
        email: user.email,
        auth_method: user.auth_method,      
    });
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Profile:");
  }
};

module.exports = { updatePassword, Profile };
