import { Types } from "mongoose";
import Library from "../models/library.model";
import Book from "../models/book.model";
export const fetchAllLibraries = async () => {
  return await Library.aggregate([
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
};

export const fetchLibraryById = async (id: string) => {
  return await Library.aggregate([
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
};

export const createNewLibrary = async (libraryData: any) => {
  return await Library.create(libraryData);
};

export const updateLibraryById = async (id: string, updatedData: any) => {
  return await Library.findByIdAndUpdate(
    id,
    updatedData,
    { new: true, runValidators: true } // Return the updated document and run validators
  );
};

export const deleteLibraryById = async (id: string) => {
  return await Library.findByIdAndDelete(id);
};

export const getLibraryInventoryById = async (libraryId: string) => {
  return await Book.aggregate([
    {
      $match: { libraryOwned: new Types.ObjectId(libraryId) }, // Match books where libraryOwned field matches libraryId
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
};

export const addBookToLibraryInventory = async (
  libraryId: string,
  bookId: string,
  libraryManagerId: string
) => {
  // Find the library by its ID
  const library = await Library.findById(libraryId);
  if (!library) {
    throw new Error("Library not found");
  }

  // Check if the authenticated user is the manager of the library
  if (library.libraryManager.toString() !== libraryManagerId) {
    throw new Error("Not authorized as library manager");
  }

  // Find the book by its ID
  const book = await Book.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  // Check if the book already belongs to a library
  if (book.libraryOwned) {
    throw new Error("Book already owned by another library");
  }

  // Update the book's libraryOwned field with the provided libraryId
  book.libraryOwned = new Types.ObjectId(libraryId);

  // Save the updated book document
  await book.save();

  return book;
};

export const removeBookFromLibraryInventory = async (
  libraryId: string,
  bookId: string,
  libraryManagerId: string
) => {
  // Find the library by its ID
  const library = await Library.findById(libraryId);

  if (!library) {
    throw new Error("Library not found");
  }
  // Check if the authenticated user is the manager of the library
  if (library.libraryManager.toString() !== libraryManagerId) {
    throw new Error("Not authorized as library manager");
  }

  // Find the book by its ID
  const book = await Book.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  // Check if the book is currently in this library's inventory
  if (book.libraryOwned?.toString() !== libraryId) {
    throw new Error("Book not in inventory");
  }

  // Remove the book from the library's inventory
  await Book.updateOne({ _id: bookId }, { $unset: { libraryOwned: 1 } });

  return book;
};
