import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";

const bookRoute: Router = Router();

bookRoute.get("/", getAllBooks);
bookRoute.get("/:id", getBookById);
bookRoute.post("/", createBook);
bookRoute.put("/:id", updateBook);
bookRoute.delete("/:id", deleteBook);

export { bookRoute };
