import { validationResult } from "express-validator";
import UserModel from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import TokenBlacklist from "../model/TokenBlacklist.js";

// Add nodemailer transporter configuration
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL, // Your email id
      pass: process.env.EMAIL_PASSWORD, // Your password or App Password
    },
  });

  
export const register = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  const { name, email, password } = req.body;

  try {
    const UserExisted = await UserModel.findOne({ email });
    if (UserExisted) {
      throw new Error("User already exists.");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });


    return res.status(201).json({
      success: true,
      message: `User registered successfully`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  const { email, password } = req.body;

  try {
    const UserExisted = await UserModel.findOne({ email });
    if (!UserExisted) {
      throw new Error("E-mail does not exist.");
    }

    const isMatch = await bcrypt.compare(password, UserExisted.password);
    if (!isMatch) {
      throw new Error("Password wrong");
    }

    const token = jwt.sign({ userId: UserExisted._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      user: {
        userId: UserExisted._id,
        email: UserExisted.email,
        name: UserExisted.name,
        createdAt: UserExisted.createdAt,
        updatedAt: UserExisted.updatedAt,
      },
      token
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("User with this email does not exist.");
      }
  
      const token = crypto.randomBytes(20).toString("hex");
  
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Password Reset",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          `http://${process.env.FRONTEND_URL}/reset/${token}\n\n` +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };
  
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email: ", err);
          return res.status(500).json({
            success: false,
            message: "There was an error sending the email.",
            error: err.message,
          });
        } else {
          console.log('Email sent: ', info.response);
          return res.status(200).json({
            success: true,
            message: "Password reset email sent successfully.",
          });
        }
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Password reset token is invalid or has expired.");
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error("New password cannot be the same as the old password.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const profile = async (req, res) => {
  try {
      const user = await UserModel.findById(req.userId).select('-password -__v');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ user });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};

// Add the changePassword function
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect.");
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error("New password cannot be the same as the old password.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(' ')[1];
    if (token) {
      await TokenBlacklist.create({ token });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




