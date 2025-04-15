import { Request, Response } from "express";
import { CustomRequest } from "../interfaces/customRequest.interface";
import Book from "../models/book.model";
import User from "../models/user.model";
import { borrowBook } from "../services/borrow.service";
import { findUserById } from "../services/user.service";
import { checkUserBorrowStatus, findBookById, returnBookToLibrary } from "../services/book.services";

export const borrowBookFromLibrary = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const borrowerId = req.userId as string;
    const { bookId, borrowCharge } = req.body;

    const result = await borrowBook(borrowerId, bookId, borrowCharge);

    return res.status(200).json({
      message: req.t("book_borrowed_success"),
      walletBalance: result.walletBalance,
    });
  } catch (error) {
    return res.status(500).json({ error: req.t("failed_borrow_book") });
  }
};

export const returnBook = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const bookId = req.params.id;
    const userId = req.userId as string; // Assuming user ID is sent in the request body

    const book = await findBookById(bookId);

    // Find the user who is returning the book
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: req.t("user_not_found") });
    }

    // Check if the book is currently borrowed
    checkUserBorrowStatus(book, userId);

    // Set the current borrower to null
    await returnBookToLibrary(bookId)

    return res.status(200).json({ message: req.t("book_returned_success") });
  } catch (error) {
    return res.status(500).json({ error: req.t("failed_return_book") });
  }
};
