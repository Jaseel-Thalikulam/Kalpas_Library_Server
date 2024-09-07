import { ObjectId } from "mongoose";

export interface IUser {
  contactNumber: string;
  password: string;
  _id: ObjectId;
  role: string;
  walletAmount: number;
}
