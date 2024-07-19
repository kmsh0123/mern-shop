// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import TokenBlacklist from "../model/TokenBlacklist.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(' ')[1];
    if (!token) {
      throw new Error("Unauthorized");
    }

    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      throw new Error("Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
