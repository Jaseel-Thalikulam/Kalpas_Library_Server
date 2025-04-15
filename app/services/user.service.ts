import { ADMIN } from "../constants";
import { IUser, IUserInput } from "../interfaces/user.interface";
import User from "../models/user.model";
import bcrypt from "bcrypt";


export const findUserByContact = async (
  contactNumber: string
): Promise<IUser | null> => {
  return await User.findOne({ contactNumber });
};



export const isAdminAlreadyPresent = async (): Promise<boolean> => {
  const existingAdmin = await User.findOne({ role: ADMIN });
  return !!existingAdmin;
};


export const createUser = async (userData: IUserInput): Promise<IUser> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const user = new User({
    ...userData,
    password: hashedPassword,
  });

  return await user.save();
};


export const findUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("user_not_found");
  return user;
};

