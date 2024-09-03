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

const libraryRoute: Router = Router();

libraryRoute.get("/", getAllLibraries);
libraryRoute.get("/:id", getLibraryById);
libraryRoute.post("/", createLibrary);
libraryRoute.put("/:id", updateLibrary);
libraryRoute.delete("/:id", deleteLibrary);

// Library Inventory
libraryRoute.get("/:id/inventory", getLibraryInventory);
libraryRoute.post("/:id/inventory", addBookToInventory);
libraryRoute.delete("/:id/inventory/:bookId", removeBookFromInventory);

export { libraryRoute };
