import { Request, Response } from "express";
import { CustomRequest } from "../interfaces/customRequest.interface";
import Book from "../models/book.model";
import User from "../models/user.model";

export const borrowBook = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const borrowerId = req.userId;
    const { bookId, borrowCharge } = req.body;

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: req.t("book_not_found") });
    }

    // Check if the book is already borrowed
    if (book.currentBorrower) {
      return res.status(400).json({ error: req.t("book_already_borrowed") });
    }

    // Check if the user exists
    const user = await User.findById(borrowerId);
    if (!user) {
      return res.status(404).json({ error: req.t("user_not_found") });
    }

    // Check if the user has enough balance in their wallet
    if (user.walletAmount < borrowCharge) {
      return res.status(400).json({ error: req.t("insufficient_funds") });
    }

    //We can implement any payment integrations like stripe,razorPay here

    // Deduct the borrowing charge from the user's wallet
    user.walletAmount -= borrowCharge;

    // Assign the current user as the borrower of the book
    book.currentBorrower = borrowerId;

    // Save the updated user and book
    await user.save();
    await book.save();

    return res.status(200).json({
      message: req.t("book_borrowed_success"),
      walletBalance: user.walletAmount,
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
    const userId = req.userId; // Assuming user ID is sent in the request body

    // Find the book by ID
    const book = await Book.findById(bookId);
    if (!book) {
     return res.status(404).json({ error: req.t("book_not_found") });
      
    }

    // Check if the book is currently borrowed
    if (!book.currentBorrower || book.currentBorrower.toString() !== userId) {
     return res.status(400).json({ error: req.t("book_not_borrowed_by_user") });
  
    }

    // Find the user who is returning the book
    const user = await User.findById(userId);
    if (!user) {
    return res.status(404).json({ error: req.t("user_not_found") });
      
    }

    // Set the current borrower to null
    await Book.updateOne({ _id: bookId }, { $unset: { currentBorrower: "" } });

    // Save the updated book

    return res.status(200).json({ message: req.t("book_returned_success") });
  } catch (error) {
    return res.status(500).json({ error: req.t("failed_return_book") });
  }
};
