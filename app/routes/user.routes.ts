import { Router } from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/user.controller";
import { validateLoginUser, validateRegisterUser } from "../helpers";

const userRoute: Router = Router();

userRoute.post("/register",validateRegisterUser, registerUser);
userRoute.post("/login", validateLoginUser, loginUser);

export { userRoute };
