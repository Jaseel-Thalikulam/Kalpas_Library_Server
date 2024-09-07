import { Schema, model, Types } from "mongoose";
import { IBook } from "../interfaces/book.interface";

const BookSchema: Schema = new Schema({
  bookName: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, required: true },
  genre: { type: String, required: true },
  author: { type: Types.ObjectId, required: true, ref: "User" },
  currentBorrower: { type: Types.ObjectId, required: false, ref: "User" },
  libraryOwned: { type: Types.ObjectId, required: false, ref: "Library" },
});

export default model<IBook>("Book", BookSchema, "Book");
