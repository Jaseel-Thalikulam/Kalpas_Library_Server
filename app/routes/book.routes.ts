import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";
import { userAuth } from "../middlewares/user.middleware";
import { ADMIN, AUTHOR, BORROWER, LIBRARYMANAGER } from "../constants";
import { validateId, validateNonFileFields } from "../helpers";
import { ImageUploader } from "../util/multerUploader";
const bookRoute: Router = Router();

bookRoute.get(
  "/",
  userAuth([BORROWER, ADMIN, LIBRARYMANAGER, AUTHOR]),
  getAllBooks
);

bookRoute.get(
  "/:id",
  userAuth([BORROWER, ADMIN, LIBRARYMANAGER, AUTHOR]),
  validateId,
  getBookById
);

bookRoute.post(
  "/",
  userAuth([AUTHOR]),
  validateNonFileFields, 
  ImageUploader.array("coverImage", 1),
  createBook
);

bookRoute.delete("/:id", userAuth([AUTHOR]), validateId, deleteBook);  

bookRoute.put(
  "/:id",
  userAuth([AUTHOR]),
  ImageUploader.array("coverImage", 1),
  validateId,
  updateBook
);


export { bookRoute };
