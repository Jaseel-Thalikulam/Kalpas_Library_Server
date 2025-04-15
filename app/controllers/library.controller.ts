import { Request, Response } from "express";
import Library from "../models/library.model";
import { Types } from "mongoose";
import Book from "../models/book.model";
import { CustomRequest } from "../interfaces/customRequest.interface";
import { addBookToLibraryInventory, createNewLibrary, deleteLibraryById, fetchAllLibraries, fetchLibraryById, getLibraryInventoryById, removeBookFromLibraryInventory, updateLibraryById } from "../services/library.service";

export const getAllLibraries = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {

    // Fetch all libraries from the database
    const libraries = await fetchAllLibraries();

    return res.status(200).json({
      message: req.t("library_fetched_success"),
      libraries,
    });
  } catch (error) {
    return res.status(500).json({ error: req.t("failed_fetch_libraries") });
  }
};

export const getLibraryById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params; // Extract the ID from the request parameters

  try {
    // Fetch library by ID using aggregation
    const library = await fetchLibraryById(id)

    if (!library.length) {
      return res.status(404).json({ error: req.t("library_not_found") });
    }

    // Return the fetched library in the response
    return res.status(200).json({
      message: req.t("library_by_id_success"),
      library: library[0], // Access the first item since aggregation returns an array
    });
  } catch (error) {
    return res.status(500).json({ error: req.t("failed_fetch_library_by_id") });
  }
};

export const createLibrary = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const libraryData = req.body;

    // Create the new library
    const newLibrary = await createNewLibrary(libraryData);

    return res.status(201).json({
      message: req.t("library_created_success"),
      library: newLibrary,
    });
  } catch (error) {
    return res.status(500).json({ error: req.t("failed_create_library") });
  }
};

export const updateLibrary = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    // Find and update the library by ID
    const updatedLibrary = await updateLibraryById(id, updatedData);

    if (!updatedLibrary) {
      return res.status(404).json({ error: req.t("library_not_found") });
    }

    // Return the updated library
    return res.status(200).json({
      message: req.t("library_updated_success"),
      library: updatedLibrary,
    });
  } catch (error) {
    return res.status(500).json({ error: req.t("failed_update_library") });
  }
};


export const deleteLibrary = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  try {
    // Find and delete the library by ID
    const deletedLibrary = await deleteLibraryById(id);

    if (!deletedLibrary) {
      return res.status(404).json({ error: req.t("library_not_found") });
    }

    // Return success response if deletion was successful
    return res.status(200).json({
      message: req.t("library_deleted_success"),
    });
  } catch (error) {
    return res.status(500).json({ error: req.t("failed_delete_library") });
  }
};

export const getLibraryInventory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    // Fetch books owned by the specified library
    const books = await getLibraryInventoryById(id);

    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: req.t("no_books_found_on_specified_library") });
    }

    // Return the fetched books
    return res.status(200).json({
      message: req.t("library_inventory_fetched_success"),
      books,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: req.t("failed_fetch_library_inventory") });
  }
};

export const addBookToInventory = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const libraryManagerId = req.userId as string; // req.userId contains the authenticated library manager's ID
    const { bookId } = req.body;
    const { id } = req.params;


     await addBookToLibraryInventory(id, bookId, libraryManagerId);

    // Respond with success message
    return res.status(201).json({ message: req.t("book_added_success") });
  } catch (error) {
    return res.status(500).json({ error: req.t("failed_add_book_inventory") });
  }
};

export const removeBookFromInventory = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const libraryManagerId = req.userId as string; // This is set by the authentication middleware
    const { bookId, id: libraryId } = req.params; // `id` represents the libraryId

    await removeBookFromLibraryInventory(libraryId, bookId, libraryManagerId);

    // Respond with success message
    return res.status(200).json({ message: req.t("book_removed_success") });
  } catch (error) {
    return res
      .status(500)
      .json({ error: req.t("failed_remove_book_inventory") });
  }
};
