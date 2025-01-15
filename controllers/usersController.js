const jwt = require("jsonwebtoken");
const { compare } = require("bcrypt");
const { findUserByEmail, createUser } = require("../models/usersModel");
const { createDefaultWallets } = require("../models/walletModel");
const { createDefaultCategory } = require("../models/categoryModel");

const handleErrorResponse = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({ message });
};

const validatePassword = (password) => {
  const validations = [
    {
      regex: /^(?=.*[A-Z]).{8,}$/,
      message:
        "Password must be at least 8 characters and include an uppercase letter.",
    },
    {
      regex: /^(?=.*\d)/,
      message: "Password must contain at least one number.",
    },
    {
      regex: /^(?=.*[!@#$%^&*(),.?":{}|<>])/,
      message: "Password must contain at least one special character.",
    },
  ];

  for (const { regex, message } of validations) {
    if (!regex.test(password)) {
      return message;
    }
  }

  return null;
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Email Not Found" });
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      message: "Login Successfully",
      user_id: user.id,
      username: user.username,
      token,
    });
  } catch (error) {
    handleErrorResponse(res, error, "Error Logging In");
  }
};

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({
        message: "Invalid registration data. Please check your inputs.",
      });
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const result = await createUser(username, email, password);
    await createDefaultWallets(result.id);
    await createDefaultCategory(result.id);
    res.status(201).json({ message: "Registration Successfully" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Registering User");
  }
};

module.exports = { login, register };
