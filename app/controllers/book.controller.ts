import { Request, Response } from "express";
import { validationResult } from "express-validator";
import fs from "fs";
import { uploadFileAndGetPublicUrl } from "../firebase";
import Book from "../models/book.model";
import { CustomRequest } from "../interfaces/customRequest.interface";
export const getAllBooks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all books from MongoDB
    const books = await Book.find(); // Fetch all documents in the "books" collection

    // If no books are found, return a 404 status
    if (books.length === 0) {
      res.status(404).json({ message: "No books found" });
      return;
    }

    // Respond with the books if successful
    res.status(200).json({
      message: "Fetched all books successfully",
      books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

export const getBookById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the book ID from the request parameters
    const { id } = req.params;

    // Fetch the book by ID from MongoDB
    const book = await Book.findById(id);

    // If the book is not found, return a 404 status
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    // Respond with the book if successful
    res.status(200).json({
      message: "Fetched book by ID successfully",
      book,
    });
  } catch (error) {
    console.error("Error fetching book by ID:", error);

    // If the error is related to an invalid MongoDB ObjectID
    if (error instanceof Error) {
      // If the error is related to an invalid MongoDB ObjectID
      if ((error as any).kind === "ObjectId") {
        res.status(400).json({ error: "Invalid book ID" });
        return;
      }
    }

    // Handle any other errors
    res.status(500).json({ error: "Failed to fetch book by ID" });
  }
};

export const createBook = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // Create a new book logic
  console.log(req.body, "i am bod");

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

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

      res.status(201).json({ message: "Book created successfully" });
      return;
    }

    res
      .status(400)
      .json({ message: "Failed to Create Book: No file uploaded" });
    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to create book" });
  }
};

export const updateBook = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const authorId = req.userId;

    // Find the book by ID
    const book = await Book.findById(id);

    // Check if the book was found
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    if (Array.isArray(req.files)) {
      const filePath = req.files[0].path;
      updateData.coverImage = await uploadFileAndGetPublicUrl(filePath);
    }

    // Check if the authorId matches the book's author
    if (book.author.toString() !== authorId) {
      res.status(403).json({ message: "Not authorized to delete this book" });
      return;
    }

    // Find the book by ID and update it with the new data
    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated book
      runValidators: true, // Run validators to ensure data integrity
    });

    // Check if the book was found and updated
    if (!updatedBook) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    res.status(200).json({
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
};

export const deleteBook = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const authorId = req.userId;

    // Find the book by ID
    const book = await Book.findById(id);

    // Check if the book was found
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    // Check if the authorId matches the book's author
    if (book.author.toString() !== authorId) {
      res.status(403).json({ message: "Not authorized to delete this book" });
      return;
    }

    // Delete the book
    await Book.findByIdAndDelete(id);

    // Successfully deleted the book
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
};
