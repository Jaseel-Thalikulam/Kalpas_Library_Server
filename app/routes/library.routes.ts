import { Router } from "express";
import {
  getAllLibraries,
  getLibraryById,
  createLibrary,
  updateLibrary,
  deleteLibrary,
  getLibraryInventory,
  addBookToInventory,
  removeBookFromInventory,
} from "../controllers/library.controller";
import { userAuth } from "../middlewares/user.middleware";
import { ADMIN, AUTHOR, BORROWER, LIBRARYMANAGER } from "../constants";
import {
  validateAddBookInventoryFields,
  validateId,
  validateLibraryFields,
  validateRemoveBookInventoryFields,
} from "../helpers";

const libraryRoute: Router = Router();

libraryRoute.post("/", userAuth([ADMIN]), validateLibraryFields, createLibrary);
libraryRoute.get(
  "/",
  userAuth([ADMIN, BORROWER, AUTHOR, LIBRARYMANAGER]),
  getAllLibraries
);
libraryRoute.get(
  "/:id",
  userAuth([ADMIN, BORROWER, AUTHOR, LIBRARYMANAGER]),
  validateId,
  getLibraryById
);
libraryRoute.put("/:id", userAuth([ADMIN]), validateId, updateLibrary);
libraryRoute.delete("/:id", userAuth([ADMIN]), validateId, deleteLibrary);

// Library Inventory
libraryRoute.get(
  "/:id/inventory",
  userAuth([LIBRARYMANAGER,ADMIN,BORROWER,AUTHOR]),
  validateId,
  getLibraryInventory
);
libraryRoute.post(
  "/:id/inventory",
  userAuth([LIBRARYMANAGER]),
  validateAddBookInventoryFields,
  addBookToInventory
);
libraryRoute.delete(
  "/:id/inventory/:bookId",
  userAuth([LIBRARYMANAGER]),
  validateRemoveBookInventoryFields,
  removeBookFromInventory
);

export { libraryRoute };
