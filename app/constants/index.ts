import dotenv from "dotenv";
//env Configuration
dotenv.config();

export const PORT = process.env.PORT as string;
export const CLIENT_URL = process.env.CLIENT_URL as string;
export const MONGODB_URL = process.env.MONGODB_URL as string;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID as string;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
