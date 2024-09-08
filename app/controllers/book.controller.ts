import { Request, Response } from "express";
import { uploadFileAndGetPublicUrl } from "../firebase";
import Book from "../models/book.model";
import { CustomRequest } from "../interfaces/customRequest.interface";
export const getAllBooks = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Fetch all books from MongoDB
    const books = await Book.find(); // Fetch all documents in the "books" collection

    // If no books are found, return a 404 status
    if (books.length === 0) {
     return res.status(404).json({ message: req.t("no_books_found") });
    
    }

    // Respond with the books if successful
   return res.status(200).json({
     message: req.t("books_fetched_success"),
     books,
   });
  } catch (error) {
   return res.status(500).json({ error: req.t("failed_fetch_books") });
  }
};

export const getBookById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract the book ID from the request parameters
    const { id } = req.params;

    // Fetch the book by ID from MongoDB
    const book = await Book.findById(id);

    // If the book is not found, return a 404 status
    if (!book) {
     return res.status(404).json({ message: req.t("no_books_found") });
    
    }

    // Respond with the book if successful
   return res.status(200).json({
     message: req.t("book_fetched_by_id_success"),
     book,
   });
  } catch (error) {
    // If the error is related to an invalid MongoDB ObjectID
    if (error instanceof Error) {
      // If the error is related to an invalid MongoDB ObjectID
      if ((error as any).kind === "ObjectId") {
      return res.status(400).json({ error: req.t("invalid_book_id") });
      
      }
    }

    // Handle any other errors
  return res.status(500).json({ error: req.t("failed_fetch_book_by_id") });
  }
};

export const createBook = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  // Create a new book logic

  try {
    const { bookName, description, genre } = req.body;

    if (Array.isArray(req.files)) {
      const filePath = req.files[0].path;
      const coverImage = await uploadFileAndGetPublicUrl(filePath);
      const author = req.userId;
      await Book.create({
        bookName,
        description,
        genre,
        coverImage,
        author,
      });

      return res.status(201).json({ message: req.t("book_created_success") });
    }

    return res.status(400).json({ message: req.t("failed_create_book") });
  } catch (error) {
    return res.status(500).json({ error: req.t("failed_create_book") });
  }
};

export const updateBook = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const authorId = req.userId;

    // Find the book by ID
    const book = await Book.findById(id);

    // Check if the book was found
    if (!book) {
     return res.status(404).json({ message: req.t("book_not_found") });
    
    }

    if (Array.isArray(req.files)) {
      const filePath = req.files[0].path;
      updateData.coverImage = await uploadFileAndGetPublicUrl(filePath);
    }

    // Check if the authorId matches the book's author
    if (book.author.toString() !== authorId) {
      return res
        .status(403)
        .json({ message: req.t("not_authorized_to_update_book") });
    
    }

    // Find the book by ID and update it with the new data
    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated book
      runValidators: true, // Run validators to ensure data integrity
    });

    // Check if the book was found and updated
    if (!updatedBook) {
     return res.status(404).json({ message: req.t("book_not_found") });
      
    }

   return res.status(200).json({
      message: req.t("book_updated_success"),
      data: updatedBook,
    });
  } catch (error) {
   return res.status(500).json({ error: req.t("failed_update_book") });
  }
};

export const deleteBook = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const authorId = req.userId;

    // Find the book by ID
    const book = await Book.findById(id);

    // Check if the book was found
    if (!book) {
      return res.status(404).json({ message: req.t("book_not_found") });
     
    }

    // Check if the authorId matches the book's author
    if (book.author.toString() !== authorId) {
     return res
       .status(403)
       .json({ message: req.t("not_authorized_to_delete_book") });
     
    }

    // Delete the book
    await Book.findByIdAndDelete(id);

    // Successfully deleted the book
   return res
     .status(200)
     .json({ message: req.t("not_authorized_to_delete_book") });
  } catch (error) {
    return res.status(500).json({ error: req.t("failed_delete_book") });
  }
};
