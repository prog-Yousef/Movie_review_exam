require("dotenv").config();

const jwt = require('jsonwebtoken');
const User = require('../models/User');




const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // make sure your environment variable name is consistent
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};


const admin = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied! you need a valid token" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded;

    if (req.user.role == "admin") {
      next();
    } else {
      res.status(401).json({
        Error_message: "Only admins can do crud operations",
      });
    }
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).send("Invalid token");
  }
};

module.exports = { protect,admin };