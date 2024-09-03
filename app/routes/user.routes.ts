import { Router } from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/user.controller";

const userRoute: Router = Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);


export { userRoute };
