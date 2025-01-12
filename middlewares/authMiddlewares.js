const jwt = require("jsonwebtoken");
require("dotenv-safe").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        message: "Akses ditolak, token tidak disediakan atau format salah",
      });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (req.params.user_id && req.params.user_id != req.user.user_id) {
      return res
        .status(403)
        .json({ message: "Akses ditolak, token tidak sesuai dengan user" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid" });
  }
};

module.exports = authMiddleware;
