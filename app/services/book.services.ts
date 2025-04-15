import { uploadFileAndGetPublicUrl } from "../firebase";
import { BookData, UpdateBookData } from "../interfaces/book.interface";
import Book from "../models/book.model";

export const findBookById = async (bookId: string) => {
  const book = await Book.findById(bookId);
  if (!book) throw new Error("book_not_found");
  return book;
};


export const checkUserBorrowStatus = (book: any, userId: string) => {
  if (!book.currentBorrower || book.currentBorrower.toString() !== userId) {
    throw new Error("book_not_borrowed_by_user");
  }
};

export const returnBookToLibrary = async (bookId: string) => {
  await Book.updateOne({ _id: bookId }, { $unset: { currentBorrower: "" } });
};


export const fetchAllBooks = async () => {
  return await Book.find();
};

export const getBookByIdService = async (id: string) => {
  return await Book.findById(id);
};


export const createBookService = async ({
  bookName,
  description,
  genre,
  author,
  filePath,
}: BookData) => {
  const coverImage = await uploadFileAndGetPublicUrl(filePath);

  const newBook = await Book.create({
    bookName,
    description,
    genre,
    coverImage,
    author,
  });

  return newBook;
};

export const updateBookService = async ({
    id,
    updateData,
   
}: UpdateBookData) => {



    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      throw new Error("FAILED_TO_UPDATE");
    }

    return updatedBook;
}


export const deleteBookService = async (id: string) => {

    await Book.findByIdAndDelete(id);

}