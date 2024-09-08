import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { IUser } from "../interfaces/user.interface";
import { ADMIN, JWT_SECRET } from "../constants";
import { generateAccessToken, generateRefreshToken } from "../helpers";
import { body, validationResult } from "express-validator";
import jwt, { JwtPayload } from "jsonwebtoken";
import i18next from "i18next";
export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { contactNumber, password, role, name, language } = req.body;

  try {
    const existingUser = await User.findOne({ contactNumber });
    if (existingUser) {
      return res.status(400).json({ error: req.t("user_exists") });
    }

    if (role === ADMIN) {
      const isAdminExist = await User.findOne({ role: role });
      if (isAdminExist) {
        return res.status(400).json({ error: req.t("admin_exists") });
      }
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      contactNumber,
      role,
      password: hashedPassword,
      name,
      language,
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).json({ message: req.t("user_register_success") });
  } catch (error) {
    return res.status(500).json({ error: req.t("failed_register_user") });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { contactNumber, password } = req.body;

    // Find the user by contact number
    const user = await User.findOne({ contactNumber });
    if (!user) {
      return res.status(404).json({ error: req.t("user_not_found") });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: req.t("invalid_password") });
    }

    // Generate an access token
    const accessToken = generateAccessToken(user);

    // Generate a refresh token
    const refreshToken = generateRefreshToken(user);

    res.cookie("i18next", user.language);
    res.cookie("accessToken", accessToken);
    res.cookie("refreshToken", refreshToken);

    return res.status(200).json({
      message: req.t("user_login_success"),
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to login user" });
  }
};
