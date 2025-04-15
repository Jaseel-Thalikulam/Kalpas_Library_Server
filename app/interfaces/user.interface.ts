import { ObjectId } from "mongoose";

export interface IUser {
  contactNumber: string;
  password: string;
  name: string;
  _id: ObjectId;
  role: string;
  language:"en"|"hi"
  walletAmount: number;
}

export interface IUserInput {
  contactNumber: string;
  password: string;
  role: string;
  name: string;
  language: "en" | "hi";
}