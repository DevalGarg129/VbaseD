const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // If token comes like "Bearer xyz"
    const actualToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    req.user = decoded; // contains user id
    next();

  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;