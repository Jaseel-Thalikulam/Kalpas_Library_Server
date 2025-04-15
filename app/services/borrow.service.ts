import Book from "../models/book.model";
import User from "../models/user.model";

export const borrowBook = async (
  borrowerId: string,
  bookId: string,
  borrowCharge: number
) => {
  // Check if the book exists
  const book = await Book.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  // Check if the book is already borrowed
  if (book.currentBorrower) {
    throw new Error("Book already borrowed");
  }

  // Check if the user exists
  const user = await User.findById(borrowerId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if the user has enough balance in their wallet
  if (user.walletAmount < borrowCharge) {
    throw new Error("Insufficient funds");
  }

  // Deduct the borrowing charge from the user's wallet
  user.walletAmount -= borrowCharge;

  // Assign the current user as the borrower of the book
  book.currentBorrower = borrowerId;

  // Save the updated user and book
  await user.save();
  await book.save();

  return {
    message: "Book borrowed successfully",
    walletBalance: user.walletAmount,
  };
};


