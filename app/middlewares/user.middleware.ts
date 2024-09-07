import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

 
import userModel from "../models/user.model";
import { JWT_SECRET } from "../constants";
import { CustomRequest } from "../interfaces/customRequest.interface";
import { isJwtPayloadValid } from "../helpers";

export const userAuth =
  (roles: string[]) =>
  (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken as string;

      if (!accessToken)
        return res
          .status(403)
          .json({ success: false, message: "User not authorized" });

      jwt.verify(accessToken, JWT_SECRET, async (err, tokenData) => {
        if (err)
          return res
            .status(403)
            .json({ success: false, message: "Verification failed" });

        const isValid = await isJwtPayloadValid(tokenData);

        const userRole = (tokenData as JwtPayload).role;

        if (!isValid || !roles.includes(userRole)) {
          return res
            .status(403)
            .json({ success: false, message: "Unauthorized User" });
        }
        req.userId = (tokenData as JwtPayload).userId;
        next();
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
  };

