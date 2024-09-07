import { Schema, model, Types } from "mongoose";
import { ILibrary } from "../interfaces/library.interface";


const LibrarySchema: Schema = new Schema({
  libraryName: { type: String, required: true },
  place: { type: String, required: true },
  libraryManager: { type: Types.ObjectId, required: true, ref: "User" },
});

export default model<ILibrary>("Library", LibrarySchema, "Library");
