import { Request, Response } from "express";
import Library from "../models/library.model";
import { Types } from "mongoose";
import Book from "../models/book.model";
import { CustomRequest } from "../interfaces/customRequest.interface";

export const getAllLibraries = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Fetch all libraries from the database
    const libraries = await Library.aggregate([
      {
        $lookup: {
          from: "User", // The collection name where the 'User' model is stored
          localField: "libraryManager",
          foreignField: "_id",
          as: "libraryManager",
        },
      },
      {
        $unwind: "$libraryManager", // Unwind the array returned from $lookup to work with a single object
      },
      {
        $project: {
          libraryName: 1,
          place: 1,
          "libraryManager.name": 1, // Only include the 'name' field of the library manager
        },
      },
    ]);

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
    const library = await Library.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) }, // Match the library with the provided ID
      },
      {
        $lookup: {
          from: "User", // The collection name where the 'User' model is stored
          localField: "libraryManager",
          foreignField: "_id",
          as: "libraryManager",
        },
      },
      {
        $unwind: "$libraryManager", // Unwind the array to get the manager object
      },
      {
        $project: {
          libraryName: 1,
          place: 1,
          "libraryManager.name": 1, // Only include the 'name' field of the library manager
        },
      },
    ]);

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
    const newLibrary = await Library.create(libraryData);

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
    const updatedLibrary = await Library.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true } // Return the updated document and run validators
    );

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
    const deletedLibrary = await Library.findByIdAndDelete(id);

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
    const books = await Book.aggregate([
      {
        $match: { libraryOwned: new Types.ObjectId(id) }, // Match books where libraryOwned field matches libraryId
      },
      {
        $lookup: {
          from: "User", // Collection name for authors
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author", // Unwind the author array
      },
      {
        $lookup: {
          from: "User", // Collection name for current borrowers
          localField: "currentBorrower",
          foreignField: "_id",
          as: "currentBorrower",
        },
      },
      {
        $unwind: {
          path: "$currentBorrower",
          preserveNullAndEmptyArrays: true, // Preserve documents where currentBorrower is null
        },
      },
      {
        $project: {
          bookName: 1,
          description: 1,
          coverImage: 1,
          genre: 1,
          "author.name": 1,
          "currentBorrower.name": 1,
        },
      },
    ]);

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
    const libraryManagerId = req.userId; // Assuming req.userId contains the authenticated library manager's ID
    const { bookId } = req.body;
    const { id } = req.params;
    const library = await Library.findById(id);

    if (!library) {
      return res.status(404).json({ error: req.t("library_not_found") });
    }

    // Check if the authenticated user is the manager of the library
    if (library.libraryManager.toString() !== libraryManagerId) {
      return res
        .status(403)
        .json({ error: req.t("not_authorized_library_manager") });
    }
    // Find the book by its ID
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: req.t("book_not_found") });
    }

    // Check if the book already belongs to a library
    if (book.libraryOwned) {
      return res.status(400).json({ error: req.t("book_already_owned") });
    }

    // Update the book's libraryOwned field with the provided libraryId
    book.libraryOwned = new Types.ObjectId(id);

    // Save the updated book document
    await book.save();

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
    const libraryManagerId = req.userId; // Assuming this is set by the authentication middleware
    const { bookId, id: libraryId } = req.params; // `id` represents the libraryId

    // Find the library by its ID
    const library = await Library.findById(libraryId);

    if (!library) {
      return res.status(404).json({ error: req.t("library_not_found") });
    }

    // Check if the authenticated user is the manager of the library
    if (library.libraryManager.toString() !== libraryManagerId) {
      return res
        .status(403)
        .json({ error: req.t("not_authorized_library_manager") });
    }

    // Find the book by its ID
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: req.t("book_not_found") });
    }

    // Check if the book is currently in this library's inventory
    if (book.libraryOwned?.toString() !== libraryId) {
      return res.status(400).json({ error: req.t("book_not_in_inventory") });
    }

    // Remove the book from the library's inventory
    await Book.updateOne({ _id: bookId }, { $unset: { libraryOwned: 1 } });

    // Respond with success message
    return res.status(200).json({ message: req.t("book_removed_success") });
  } catch (error) {
    return res
      .status(500)
      .json({ error: req.t("failed_remove_book_inventory") });
  }
};
