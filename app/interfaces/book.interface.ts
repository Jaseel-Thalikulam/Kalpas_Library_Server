import { Types } from "mongoose";

export interface IBook extends Document {
  bookName: string;
  description: string;
  author: Types.ObjectId;
  genre: string;
  coverImage: string;
  libraryOwned: Types.ObjectId;
  currentBorrower?:Types.ObjectId|string
}
