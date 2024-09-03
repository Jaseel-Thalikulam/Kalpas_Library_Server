import { Router } from "express";
import { borrowBook, returnBook } from "../controllers/borrow.controller";


const borrowRoute: Router = Router();

borrowRoute.post("/", borrowBook);
borrowRoute.put("/return/:id", returnBook);

export { borrowRoute };
