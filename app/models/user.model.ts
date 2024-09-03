import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface"; 

const UserSchema: Schema = new Schema({
  contactNumber: { type: String, required: true },
  password: { type: String, required: true },
});

export default model<IUser>("User", UserSchema, "User");

