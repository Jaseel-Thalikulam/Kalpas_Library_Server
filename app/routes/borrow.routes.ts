import { Router } from "express";
import { borrowBook, returnBook } from "../controllers/borrow.controller";
import { userAuth } from "../middlewares/user.middleware";
import { BORROWER } from "../constants";
import { validateBorrowBookFields } from "../helpers";

const borrowRoute: Router = Router();

borrowRoute.post(
  "/",
  userAuth([BORROWER]),
  validateBorrowBookFields,
  borrowBook
);
borrowRoute.put("/return/:id", userAuth([BORROWER]), returnBook);

export { borrowRoute };
