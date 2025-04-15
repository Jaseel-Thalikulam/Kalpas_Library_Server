import { Types } from "mongoose";

export interface IBook extends Document {
  bookName: string;
  description: string;
  author: Types.ObjectId;
  genre: string;
  coverImage: string;
  libraryOwned: Types.ObjectId;
  currentBorrower?: Types.ObjectId | string;
}

export interface BookData {
  bookName: string;
  description: string;
  genre: string;
  author: string;
  filePath: string;
}

export interface UpdateBookData {
  id: string;
  updateData: any;
}
