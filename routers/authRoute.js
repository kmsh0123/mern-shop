import { Router } from "express";
import { login, register, forgotPassword, resetPassword, profile, changePassword, logout } from "../controllers/authController.js";
import { body } from "express-validator";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import passport from "passport";
import dotenv from "dotenv"

dotenv.config();
const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Please enter name must have").isLength({ min: 3 }).withMessage("Please enter name must have at least 3 characters."),
    body("password").trim().notEmpty().withMessage("Please enter password must have").isLength({ min: 5 }).withMessage("Please enter password must have at least 5 characters."),
    body("email").trim().isEmail().withMessage("Please enter a valid E-mail"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Please enter a valid E-mail"),
    body("password").trim().notEmpty().withMessage("Please enter password must have").isLength({ min: 5 }).withMessage("Please enter password must have at least 5 characters."),
  ],
  login
);

router.post(
  "/forgot-password",
  [body("email").trim().isEmail().withMessage("Please enter a valid E-mail")],
  forgotPassword
);

router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Token is required"),
    body("newPassword").trim().notEmpty().withMessage("Please enter password must have").isLength({ min: 5 }).withMessage("Please enter password must have at least 5 characters."),
  ],resetPassword
);

router.post(
  "/change-password",
  isAuthenticated,
  [
    body("currentPassword").trim().notEmpty().withMessage("Please enter your current password."),
    body("newPassword").trim().notEmpty().withMessage("Please enter a new password.").isLength({ min: 5 }).withMessage("The new password must have at least 5 characters."),
  ],
  changePassword
);

router.get("/profile",isAuthenticated,profile)

router.post("/logout", isAuthenticated, logout);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', 
  { successRedirect: `http://localhost:5173/`},
  { failureRedirect: `http://localhost:5173/login` }
));

export default router;
