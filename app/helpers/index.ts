import {
  ADMIN,
  AUTHOR,
  BORROWER,
  JWT_SECRET,
  LIBRARYMANAGER,
} from "../constants";
import { IUser } from "../interfaces/user.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import { body, param, validationResult } from "express-validator";
import userModel from "../models/user.model";
import { ImageUploader } from "../util/multerUploader";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "4h",
  });
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Define the validation rules
export const validateRegisterUser = [
  body("language")
    .isString()
    .withMessage("Language must be string")
    .isIn(["en", "hi"])
    .withMessage("Role must be one of the following: en, hi"),
  body("contactNumber")
    .isMobilePhone("en-IN")
    .withMessage("Please provide a valid contact number"),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .isString()
    .withMessage("Role must be a string")
    .isIn([AUTHOR, BORROWER, ADMIN, LIBRARYMANAGER]) // Adjust roles as needed
    .withMessage(
      "Role must be one of the following: author, borrower ,libraryManager"
    ),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateBorrowBookFields = [
  body("bookId").isMongoId().withMessage("Please provide a valid BookId"),
  body("borrowCharge").isNumeric().withMessage("Borrow Charge must be string"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateAddBookInventoryFields = [
  param("id")
    .notEmpty()
    .withMessage("Library ID is required")
    .isMongoId()
    .withMessage("Library ID must be a valid MongoDB ObjectID"),
  body("bookId")
    .notEmpty()
    .withMessage("Book ID is required")
    .isMongoId()
    .withMessage("Book ID must be a valid MongoDB ObjectID"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
export const validateRemoveBookInventoryFields = [
  param("id")
    .notEmpty()
    .withMessage("Library ID is required")
    .isMongoId()
    .withMessage("Library ID must be a valid MongoDB ObjectID"),
  param("bookId")
    .notEmpty()
    .withMessage("Book ID is required")
    .isMongoId()
    .withMessage("Book ID must be a valid MongoDB ObjectID"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
export const validateLibraryFields = [
  body("libraryName")
    .trim()
    .notEmpty()
    .withMessage("Library name is required")
    .isLength({ min: 3 })
    .withMessage("Library name must be at least 3 characters long"),
  body("place").trim().notEmpty().withMessage("Place is required"),
  body("libraryManager")
    .notEmpty()
    .withMessage("Library manager is required")
    .isMongoId()
    .withMessage("Library manager must be a valid MongoDB ObjectId"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateLoginUser = [
  body("contactNumber")
    .isMobilePhone("en-IN")
    .withMessage("Please provide a valid contact number"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateNonFileFields = [
  body("bookName")
    .notEmpty()
    .withMessage("Book name is required")
    .isString()
    .withMessage("Book name must be a string"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  body("genre")
    .notEmpty()
    .withMessage("Genre is required")
    .isString()
    .withMessage("Genre must be a string"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export async function isJwtPayloadValid(
  object: string | JwtPayload | undefined
): Promise<boolean> {
  if (typeof object === "object" && object !== null && "userId" in object) {
    const isValidUser = await userModel
      .findById(object.userId)
      .select("contactNumber");
    if (isValidUser) {
      return true && "userId" in object;
    }
  }
  return false;
}

export function deleteOldFiles(directory = "uploads", maxAgeInMinutes = 5) {
  try {
    const currentTime = new Date();
    const maxAge = maxAgeInMinutes * 60 * 1000;

    const files = fs.readdirSync(directory);
    for (const file of files) {
      const filePath = directory + "/" + file;
      const stats = fs.statSync(filePath);
      const fileAge = currentTime.getTime() - stats.birthtime.getTime();

      if (fileAge > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${filePath}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
