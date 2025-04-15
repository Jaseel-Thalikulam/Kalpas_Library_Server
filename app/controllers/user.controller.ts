import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { ADMIN } from "../constants";
import { generateAccessToken, generateRefreshToken } from "../helpers";
import {validationResult } from "express-validator";
import { createUser, findUserByContact, isAdminAlreadyPresent } from "../services/user.service";
import { IUser, IUserInput } from "../interfaces/user.interface";
export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { contactNumber, password, role, name, language }: IUserInput =
    req.body;

  try {
    const existingUser = await findUserByContact(contactNumber);
    if (existingUser) {
      return res.status(400).json({ error: req.t("user_exists") });
    }

    if (role === ADMIN) {
     const isAdminExists = await isAdminAlreadyPresent();
      if (isAdminExists) {
        return res.status(400).json({ error: req.t("admin_exists") });
      }
    }

    await createUser({
      contactNumber,
      password,
      role,
      name,
      language,
    });

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
    const user = await findUserByContact(contactNumber);

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
