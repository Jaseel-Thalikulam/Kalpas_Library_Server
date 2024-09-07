import dotenv from "dotenv";
//env Configuration
dotenv.config();

export const PORT = process.env.PORT as string;
export const CLIENT_URL = process.env.CLIENT_URL as string;
export const MONGODB_URL = process.env.MONGODB_URL as string;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID as string;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const AUTHOR = "author";
export const BORROWER = "borrower";
export const ADMIN = "admin";
export const LIBRARYMANAGER = "libraryManager";
export const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET as string;
export const FIREBASE_SERVICE_ACCOUNT_BASE_64 = process.env
  .FIREBASE_SERVICE_ACCOUNT_BASE_64 as string;