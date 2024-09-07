import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const UserSchema: Schema = new Schema({
  contactNumber: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["author", "borrower", "admin", "libraryManager"],
    required: true,
  },
  walletAmount: { type: Number, default: 50 },
});

export default model<IUser>("User", UserSchema, "User");
